const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const { PubSub } = require("apollo-server");
const { createServer } = require("http");
const User = require("./models/user");
const Conversation = require("./models/conversation");
const Message = require("./models/message");
const config = require("../../utils/config");
const imageStore = require("./utils/imageStore");
const express = require("express");
const generator = require("generate-password");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DEFAULT_IMAGE = imageStore.DEFAULT_IMAGE;
const MONGODB_URI = config.MONGODB_URI;
const JWT_SECRET_KEY = config.JSON_SECRET_KEY;

const mailService = require("./services/emailService");

const pubsub = new PubSub();

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Couldn't connect to MongoDB see error:", error.message);
  });

//Fix mongoose methods
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const typeDefs = gql`
  type User {
    _id: String!
    firstName: String
    lastName: String
    fullName: String
    email: String
    username: String
    password: String
    confirmed: Boolean
    profilePicture: String
    validationCode: String
    about: String
  }

  type addUserResp {
    User: User
    errorList: [String]
  }

  type userDetails {
    about: String
    profilePicture: String
  }

  type Conversation {
    _id: String
    members: [User]
    lastSender: String
    lastMessage: String
    lastMessageTime: String
    unread: Boolean
    sender: [User]
  }

  type Message {
    _id: String!
    conversationID: String!
    senderID: String!
    receiverID: String!
    content: String!
    time: String!
  }

  type Query {
    getEmail(username: String): String
    loggedIn: User
    checkEmail(email: String, type: String): String
    getAbout(_id: String!): String
    getImage(_id: String!): String
    searchUser(_id: String!, type: String!, search: String!): [User]
    getSingleUser(_id: String!): User
    getConversations(_id: String): [Conversation]
    getMessages(senderID: String!, receiverID: String!): [Message]
  }

  type loginResp {
    User: User
    Token: String
    errorList: String
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      username: String!
      password: String!
    ): addUserResp

    login(username: String!, password: String!): loginResp
    validateAccount(username: String!, validationCode: String!): String!
    editAbout(_id: String!, about: String!): String!
    editImage(_id: String!, image: String!): String!
    changeName(_id: String!, firstName: String!, lastName: String!): String
    changeUserName(_id: String, username: String!): String
    changePassword(
      _id: String!
      currentPassword: String!
      newPassword: String!
    ): String!
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

const resolvers = {
  Query: {
    getEmail: async (root, args) => {
      if (args.username === "") return "";
      let user = await User.findOne({ username: args.username });
      let verificationCode = generator.generate({ length: 8, numbers: true });
      let validationCodeHash = await bcrypt.hash(verificationCode, 10);
      await User.findByIdAndUpdate(user._id, {
        validationCode: validationCodeHash,
      });
      await mailService.sendEmail("CONFIRM", {
        toFullName: user.fullName,
        toEmail: user.email,
        code: verificationCode,
      });
      return user.email;
    },

    loggedIn: async (root, args, context) => {
      let activeUser = await (context.currentUser != null
        ? context.currentUser
        : null);
      return activeUser;
    },

    getAbout: async (root, args) => {
      let user = await User.findById(args._id);
      return user.about;
    },

    getImage: async (root, args) => {
      let user = await User.findById(args._id);
      return user.profilePicture;
    },

    checkEmail: async (root, args) => {
      let user = await User.findOne({ email: args.email.toLowerCase() });
      let result = user != null ? "validEmail" : "No associated email found";
      if (result === "validEmail") {
        if (args.type === "Username") {
          await mailService.sendEmail("USERNAME", {
            toFullName: user.fullName,
            toEmail: user.email,
            username: user.username,
          });
        } else if (args.type === "Password") {
          let newPass = generator.generate({ length: 8, numbers: true });
          let bcryptPass = await bcrypt.hash(newPass, 10);
          await User.findByIdAndUpdate(user._id, { password: bcryptPass });
          await mailService.sendEmail("PASSWORD", {
            toFullName: user.fullName,
            toEmail: user.email,
            password: newPass,
          });
        }
      }
      return result;
    },

    searchUser: async (root, args) => {
      if (args.search === "") return [];
      let dbSearch = `\W*((?i)${args.search}(?-i))\W*`;
      let _id = args._id;
      if (args.type === "contact") {
        let searchResult = await User.find({
          _id: { $ne: _id },
          fullName: { $regex: dbSearch },
          confirmed: true,
        });
        return searchResult;
      } else if (args.type === "normal") {
        let searchResult = await User.find({
          _id: { $ne: _id },
          fullName: { $regex: dbSearch },
          confirmed: true,
        });
        return searchResult;
      }
    },

    getSingleUser: async (root, args) => {
      if (args._id === "") return null;
      let user = await User.findById(args._id);
      return user;
    },

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
    addUser: async (root, args) => {
      args.password = await bcrypt.hash(args.password, 10);
      args.fullName = `${args.firstName} ${args.lastName}`;
      args.confirmed = false;
      args.about = "";
      args.profilePicture = DEFAULT_IMAGE;
      args.username = args.username.toLowerCase();
      args.email = args.email.toLowerCase();
      const verificationCode = generator.generate({ length: 8, numbers: true });
      args.validationCode = await bcrypt.hash(verificationCode, 10);
      let user = new User({ ...args });
      try {
        await user.save();
      } catch (error) {
        let userError =
          (await User.collection.countDocuments({
            username: args.username,
          })) > 0
            ? "User Already Used"
            : null;
        let emailError =
          (await User.collection.countDocuments({
            email: args.email,
          })) > 0
            ? "Email Already Used"
            : null;
        return { errorList: [userError, emailError] };
      }
      await mailService.sendEmail("CONFIRM", {
        toFullName: args.fullName,
        toEmail: args.email,
        code: verificationCode,
      });
      return { User: user };
    },

    login: async (root, args) => {
      try {
        const user = await User.findOne({
          username: args.username.toLowerCase().replace(/ /g, ""),
        });

        if (!(await bcrypt.compare(args.password, user.password))) {
          return { errorList: "Username or Password is incorrect" };
        } else if (!user.confirmed) {
          return { errorList: "Please confirm your email address to login" };
        }
        const userSign = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          confirmed: user.confirmed,
        };
        return { User: user, Token: jwt.sign(userSign, JWT_SECRET_KEY) };
      } catch (error) {
        return { errorList: "Username or Password is incorrect" };
      }
    },

    validateAccount: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (
        !(await bcrypt.compare(args.validationCode.trim(), user.validationCode))
      ) {
        return "Invalid Validation Code";
      } else {
        await User.findByIdAndUpdate(user._id, {
          validationCode: null,
          confirmed: true,
        });
        return "Account verified";
      }
    },

    editAbout: async (root, args) => {
      await User.findByIdAndUpdate(args._id, { about: args.about });
      return args.about;
    },

    editImage: async (root, args) => {
      await User.findByIdAndUpdate(args._id, { profilePicture: args.image });
      return args.image;
    },

    changeName: async (root, args) => {
      await User.findByIdAndUpdate(args._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        fullName: `${args.firstName} ${args.lastName}`,
      });
      return "Success";
    },

    changeUserName: async (root, args) => {
      if (
        (await User.collection.countDocuments({
          username: args.username,
        })) > 0
      ) {
        return "Username is already in use";
      }
      await User.findByIdAndUpdate(args._id, { username: args.username });
      return "Success";
    },

    changePassword: async (root, args) => {
      user = await User.findById(args._id);
      if (!(await bcrypt.compare(args.currentPassword, user.password))) {
        return "Incorrect Current password";
      } else if (await bcrypt.compare(args.newPassword, user.password)) {
        return "You're currently using this password";
      }
      let hashPassword = await bcrypt.hash(args.newPassword, 10);
      await User.findByIdAndUpdate(args._id, { password: hashPassword });
      return "Success";
    },
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
      pubsub.publish("NEW_MESSAGE", { newMessage: message });
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

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const cookie = req ? req.headers.cookie : null;
    if (cookie && cookie.toLowerCase().startsWith("token")) {
      try {
        const decodedToken = jwt.verify(cookie.substring(6), JWT_SECRET_KEY);
        const currentUser = await User.findById(decodedToken._id);
        return { currentUser };
      } catch (error) {
        return null;
      }
    }

    return null;
  },
});

const app = express();
const path = require("path");

app.use(cors());
app.use("/", express.static(__dirname + "/../client/"));
app.get("/", function (response) {
  response.sendFile(path.join(__dirname + "/../client/index.html"));
});

apolloServer.applyMiddleware({ app });

const port = process.env.PORT || 4000;
const httpServer = createServer(app);


apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen({ port });
