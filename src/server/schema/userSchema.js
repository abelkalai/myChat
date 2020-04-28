const { gql } = require("apollo-server-express");
const User = require("../models/user");
const config = require("../../../utils/config");
const { DEFAULT_IMAGE } = require("../images/imageStore");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");

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
    validationCode: String
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
    getUser(_id: String!): User
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
    validateAccount(username: String!, validationCode: String!): [String]
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
      let user = await User.findOne({ email: args.email.toLowerCase() });
      let result = user ? "validEmail" : "No associated email found";
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
      if (!args.search) return [];
      let regSearch = `\W*((?i)${args.search}(?-i))\W*`;
      let _id = args._id;

      let searchResult = await User.find({
        _id: { $ne: _id },
        fullName: { $regex: regSearch },
        confirmed: true,
      });
      return searchResult;
    },

    getUser: async (root, args) => {
      if (!args._id) return null;
      let user = await User.findById(args._id);
      return user;
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
      let errors = [];

      if(args.password != args.passwordConfirm){
        errors.push("Passwords don't match")
      }
      if(args.username.length > 32){
        errors.push("Username too long")
      }
      if(args.fullName.length > 26){
        errors.push("Full Name too long")
      }
      if (
        (await User.collection.countDocuments({
          username: args.username,
        })) > 0
      ) {
        errors.push("User Already Used");
      }

      if (
        (await User.collection.countDocuments({
          email: args.email,
        })) > 0
      ) {
        errors.push("Email Already Used");
      }
   
      if (errors.length === 0) {
        await user.save();
        await mailService.sendEmail("CONFIRM", {
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
      const user = await User.findOne({
        username: args.username.toLowerCase().replace(/ /g, ""),
      });

      if (!(await bcrypt.compare(args.password, user.password))) {
        return { errorList: "Username or Password is incorrect" };
      } else if (!user.confirmed) {
        let verificationCode = generator.generate({
          length: 8,
          numbers: true,
        });
        let validationCodeHash = await bcrypt.hash(verificationCode, 10);
        await User.findByIdAndUpdate(user._id, {
          validationCode: validationCodeHash,
        });
        await mailService.sendEmail("CONFIRM", {
          toFullName: user.fullName,
          toEmail: user.email,
          code: verificationCode,
        });
        return {
          email: user.email,
          errorList: "Please confirm your email to login",
        };
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
      return {
        User: user,
        Token: jwt.sign(userSign, JWT_SECRET_KEY),
        errorList: null,
      };
    },

    validateAccount: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (
        !(await bcrypt.compare(args.validationCode.trim(), user.validationCode))
      ) {
        return ["Invalid Validation Code"];
      } else {
        await User.findByIdAndUpdate(user._id, {
          validationCode: null,
          confirmed: true,
        });
        return [];
      }
    },

    editAbout: async (root, args) => {
      await User.findByIdAndUpdate(args._id, { about: args.about.trim() });
      return args.about;
    },

    editImage: async (root, args) => {
      await User.findByIdAndUpdate(args._id, { profilePicture: args.image });
      return args.image;
    },

    changeName: async (root, args) => {
      let errors = [];
      let fullName = `${args.firstName} ${args.lastName}`;
      if (fullName.length > 26) {
        errors.push("Combined Name too long");
      }
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
          username: args.username,
        })) > 0
      ) {
        errors.push("Username is already in use");
      }
      if (args.username.length > 32) {
        errors.push("Username too long");
      }

      if (errors.length == 0) {
        await User.findByIdAndUpdate(args._id, { username: args.username });
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
