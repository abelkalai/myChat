const { gql } = require("apollo-server-express");
const User = require("../models/user");
const config = require("../../../config");
const { DEFAULT_IMAGE } = require("../images/imageStore");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
const mongoose = require("mongoose");
const mailService = require("../services/emailService");

const JWT_SECRET_KEY = config.JSON_SECRET_KEY;

const userTypeDefs = gql`
  type User {
    _id: String!
    firstName: String
    lastName: String
    fullName: String
    email: String
    username: String
    confirmed: Boolean
    profilePicture: String
    verifcationCode: String
    about: String
  }

  type addUserResponse {
    User: User
    errorList: [String]
  }

  type userDetails {
    about: String
    profilePicture: String
  }

  type Query {
    forgotCredential(email: String, type: String): String
    loggedIn: User
    getAbout(_id: String!): String
    getProfilePicture(_id: String!): String
    searchUser(_id: String!, search: String!): [User]
    getUser(_id: String!, myID: String!): User
  }

  type loginResp {
    User: User
    Token: String
    errorList: String
    email: String
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      username: String!
      password: String!
      passwordConfirm: String!
    ): addUserResponse

    login(username: String!, password: String!): loginResp
    verifyEmail(email: String!, verificationCode: String!): [String]
    editAbout(_id: String!, about: String!): String!
    editImage(_id: String!, image: String!): String!
    changeName(_id: String!, firstName: String!, lastName: String!): [String]
    changeUserName(_id: String, username: String!): [String]
    changePassword(
      _id: String!
      currentPassword: String!
      newPassword: String!
      newPasswordConfirm: String!
    ): [String]
  }
`;

const userResolvers = {
  Query: {
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

    getProfilePicture: async (root, args) => {
      let user = await User.findById(args._id);
      return user.profilePicture;
    },

    forgotCredential: async (root, args) => {
      let user = await User.find({
        email: { $regex: new RegExp(`^${args.email}`, "i") },
      }).limit(1);
      let result = user.length > 0 ? "validEmail" : "No associated email found";
      if (result === "validEmail") {
        if (args.type === "Username") {
          await mailService.sendEmail("USERNAME", {
            toFullName: user[0].fullName,
            toEmail: user[0].email,
            username: user[0].username,
          });
        } else if (args.type === "Password") {
          let newPass = generator.generate({ length: 8, numbers: true });
          let bcryptPass = await bcrypt.hash(newPass, 10);
          await User.findByIdAndUpdate(user[0]._id, { password: bcryptPass });
          await mailService.sendEmail("PASSWORD", {
            toFullName: user[0].fullName,
            toEmail: user[0].email,
            password: newPass,
          });
        }
      }
      return result;
    },

    searchUser: async (root, args) => {
      if (!args.search) return [];
      let regSearch = `\W*((?i)${args.search}(?-i))\W*`;

      let searchResult = await User.find({
        _id: { $ne: args._id },
        fullName: { $regex: regSearch },
        confirmed: true,
      });
      return searchResult;
    },

    getUser: async (root, args) => {
      if (!mongoose.isValidObjectId(args._id)) {
        return null;
      }
      if (!(await User.exists({ _id: args._id }))) {
        return null;
      }

      let user = await User.find({
        $and: [{ _id: args._id }, { _id: { $ne: args.myID } }],
      }).limit(1);
      return user[0];
    },
  },
  Mutation: {
    addUser: async (root, args) => {
      args.fullName = `${args.firstName} ${args.lastName}`;
      args.confirmed = false;
      args.about = "";
      args.profilePicture = DEFAULT_IMAGE;
      const verificationCode = generator.generate({ length: 8, numbers: true });

      let errors = [];
      console.log(args.password, args.passwordConfirm);
      if (args.password != args.passwordConfirm) {
        errors.push("Passwords don't match");
      }
      if (
        (await User.collection.countDocuments({
          username: { $regex: new RegExp(`^${args.username}$`, "i") },
        })) > 0
      ) {
        errors.push("Username already used");
      }

      if (
        (await User.collection.countDocuments({
          email: { $regex: new RegExp(`^${args.email}$`, "i") },
        })) > 0
      ) {
        errors.push("Email already used");
      }
      args.password = await bcrypt.hash(args.password, 10);
      let user = new User({ ...args });
      if (errors.length === 0) {
        await user.save();
        await mailService.sendEmail("VERIFY", {
          toFullName: args.fullName,
          toEmail: args.email,
          code: verificationCode,
        });
        return { User: user, errorList: errors };
      } else {
        return { errorList: errors };
      }
    },

    login: async (root, args) => {
      const user = await User.find({
        username: { $regex: new RegExp(`^${args.username}$`, "i") },
      }).limit(1);
      if (user.length === 0) {
        return { errorList: "Username or Password is incorrect" };
      }
      if (!(await bcrypt.compare(args.password, user[0].password))) {
        return { errorList: "Username or Password is incorrect" };
      } else if (!user[0].confirmed) {
        let verificationCode = generator.generate({
          length: 8,
          numbers: true,
        });
        let verificationCodeHash = await bcrypt.hash(verificationCode, 10);
        await User.findByIdAndUpdate(user[0]._id, {
          verificationCode: verificationCodeHash,
        });
        await mailService.sendEmail("VERIFY", {
          toFullName: user[0].fullName,
          toEmail: user[0].email,
          code: verificationCode,
        });
        return {
          email: user[0].email,
          errorList: "Please verify your email to login",
        };
      }
      const userSign = {
        _id: user[0]._id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        fullName: user[0].fullName,
        username: user[0].username,
        email: user[0].email,
        confirmed: user[0].confirmed,
      };
      return {
        User: user[0],
        Token: jwt.sign(userSign, JWT_SECRET_KEY),
        errorList: null,
      };
    },

    verifyEmail: async (root, args) => {
      const user = await User.find({
        email: { $regex: new RegExp(`^${args.email}$`, "i") },
      }).limit(1);
      if (
        !(await bcrypt.compare(args.verificationCode, user[0].verificationCode))
      ) {
        return ["Invalid Verification Code"];
      } else {
        await User.findByIdAndUpdate(user[0]._id, {
          verifcaitonCode: null,
          confirmed: true,
        });
        return [];
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
      let errors = [];
      let fullName = `${args.firstName} ${args.lastName}`;
      if (errors.length === 0) {
        await User.findByIdAndUpdate(args._id, {
          firstName: args.firstName,
          lastName: args.lastName,
          fullName,
        });
      }
      return errors;
    },

    changeUserName: async (root, args) => {
      let errors = [];
      if (
        (await User.collection.countDocuments({
          username: { $regex: new RegExp(`^${args.username}$`, "i") },
        })) > 0
      ) {
        errors.push("Username is already in use");
      }

      if (errors.length == 0) {
        await User.findByIdAndUpdate(args._id, {
          username: args.username,
        });
      }
      return errors;
    },

    changePassword: async (root, args) => {
      user = await User.findById(args._id);
      let errors = [];

      if (await bcrypt.compare(args.newPassword, user.password)) {
        errors.push("You're currently using this password");
      }

      if (!(await bcrypt.compare(args.currentPassword, user.password))) {
        errors.push("Incorrect Current password");
      }
      if (args.newPassword != args.newPasswordConfirm) {
        errors.push("Passwords do not match");
      }

      if (errors.length == 0) {
        let hashPassword = await bcrypt.hash(args.newPassword, 10);
        await User.findByIdAndUpdate(args._id, { password: hashPassword });
      }
      return errors;
    },
  },
};

module.exports = { userTypeDefs, userResolvers };
