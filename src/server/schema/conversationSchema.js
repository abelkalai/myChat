const { gql } = require("apollo-server-express");
const Conversation = require("../models/conversation");
const mongoose = require("mongoose");

const conversationTypeDefs = gql`
  type Conversation {
    _id: String
    members: [User]
    lastSender: String
    lastMessage: String
    lastMessageTime: String
    unread: Boolean
    sender: [User]
  }

  extend type Query {
    getConversations(_id: String): [Conversation]
  }
`;

const conversationResolvers = {
  Query: {
    getConversations: async (root, args) => {
      let objectID = mongoose.mongo.ObjectId(args._id);
      let conversations = await Conversation.aggregate([
        { $match: { members: { $in: [objectID] } } },
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
      return conversations;
    },
  },
};

module.exports = { conversationTypeDefs, conversationResolvers };
