const { gql } = require("apollo-server-express");
const { PubSub } = require("apollo-server");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const mongoose = require("mongoose");
const pubsub = new PubSub();

const messageTypeDefs = gql`
  type Message {
    _id: String!
    conversationID: String!
    senderID: String!
    receiverID: String!
    content: String!
    time: String!
  }

  extend type Query {
    getMessages(senderID: String!, receiverID: String!): [Message]
  }

  extend type Mutation {
    readMessage(_id: String!): String
    sendMessage(
      senderID: String!
      receiverID: String!
      content: String!
    ): String
  }

  type Subscription {
    newMessage: Message
    updatedConvo: Conversation
  }
`;

const messageResolvers = {
  Query: {
    getMessages: async (root, args) => {
      if (args.receiverID === "") return null;
      let senderID = args.senderID;
      let receiverID = args.receiverID;
      let messages = await Message.find({
        $or: [
          { senderID: senderID, receiverID: receiverID },
          { senderID: receiverID, receiverID: senderID },
        ],
      }).sort({ time: -1 });
      return messages;
    },
  },
  Mutation: {
    readMessage: async (root, args) => {
      await Conversation.findByIdAndUpdate(args._id, { unread: false });
      return args._id;
    },
    sendMessage: async (root, args) => {
      let existingConvo = await Conversation.findOne({
        members: { $all: [args.senderID, args.receiverID] },
      });

      let time = new Date();
      if (existingConvo === null) {
        let newConvo = new Conversation({
          members: [args.senderID, args.receiverID],
          lastSender: args.senderID,
          lastMessage: args.content,
          lastMessageTime: time,
          unread: true,
        });
        await newConvo.save();
      } else {
        await Conversation.findOneAndUpdate(
          {
            members: { $all: [args.senderID, args.receiverID] },
          },
          {
            lastSender: args.senderID,
            lastMessage: args.content,
            lastMessageTime: time,
            unread: true,
          }
        );
      }

      let updateConvo = await Conversation.findOne({
        members: { $all: [args.senderID, args.receiverID] },
      });
      args.time = time;
      args.conversationID = updateConvo._id;
      let message = new Message({ ...args });

      try {
        await message.save();
      } catch (error) {
        return "Could not send message";
      }
  
      let senderID = mongoose.mongo.ObjectId(args.senderID);
      let receiverID = mongoose.mongo.ObjectId(args.receiverID);
      let conversations = await Conversation.aggregate([
        { $match: { members: { $all: [senderID, receiverID] } } },
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "_id",
            as: "members",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "lastSender",
            foreignField: "_id",
            as: "sender",
          },
        },
        {
          $project: {
            "members._id": 1,
            "members.profilePicture": 1,
            "members.fullName": 1,
            "sender.fullName": 1,
            lastSender: 1,
            lastMessage: 1,
            lastMessageTime: 1,
            unread: 1,
          },
        },
        { $sort: { lastMessageTime: -1 } },
      ]);
      pubsub.publish("UPDATED_CONVO", { updatedConvo: conversations[0] });
      pubsub.publish("NEW_MESSAGE", { newMessage: message });
      return "Success Message Sent";
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator(["NEW_MESSAGE"]),
    },
    updatedConvo: {
      subscribe: () => pubsub.asyncIterator(["UPDATED_CONVO"]),
    },
  },
};

module.exports = { messageTypeDefs, messageResolvers };
