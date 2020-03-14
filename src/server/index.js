const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const User = require("./models/user");
const config = require("./utils/config");
const express = require("express");
const generator = require('generate-password')
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MONGODB_URI = config.MONGODB_URI;
const JWT_SECRET_KEY = config.JSON_SECRET_KEY;

const mailService = require("./services/emailService");

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.log("Couldn't connect to MongoDB see error:", error.message);
  });

//Fix mongoose methods
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify",false)

const typeDefs = gql`
  type User {
    _id: String!
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    password: String!
    confirmed: Boolean!
    validationCode: String
  }

  type addUserResp {
    User: User
    errorList: [String]
  }

  type Query {
    allUsers: [User!]!
    loggedIn: User
    checkEmail(email: String type: String): String
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
    validateAccount(email: String! validationCode: String!): String!
  }
`;

const resolvers = {
  Query: {
    allUsers: () => {
      return User.find({});
    },

    loggedIn: async (placeHolder, args, context) => {
      let activeUser = await (context.currentUser != null
        ? context.currentUser
        : null);
      return activeUser;
    },

    checkEmail: async (placeHolder, args) => {
      let user = await User.findOne({ email: args.email.toLowerCase() });
      let result = user.length>0 ? "validEmail" : "No associated email found";
      if (result == "validEmail") {
        if (args.type == "Username") {
          await mailService.sendEmail('USERNAME', {
            toFName: user.firstName,
            toLName: user.lastName,
            toEmail: user.email,
            username: user.username
          });
        }
        else if (args.type=="Password"){
          let newPass=generator.generate({length: 10, numbers: true})
          let bcryptPass = await bcrypt.hash(newPass, 10)
          await User.findByIdAndUpdate(user._id,{password: bcryptPass})
          await mailService.sendEmail('PASSWORD', {
            toFName: user.firstName,
            toLName: user.lastName,
            toEmail: user.email,
            password: newPass,
          });
        }
      }
      return result;
    }
  },
  Mutation: {
    addUser: async (placeHolder, args) => {
      args.password = await bcrypt.hash(args.password, 10);
      args.confirmed = false;
      args.username= args.username.toLowerCase()
      args.email=args.email.toLowerCase()
      args.validationCode=generator.generate({length: 10, numbers: false})
      let user = new User({ ...args });
      try {
        await user.save();
      } catch (error) {
        let userError =
          (await User.collection.countDocuments({
            username: args.username
          })) > 0
            ? "User Already Exists"
            : null;
        let emailError =
          (await User.collection.countDocuments({
            email: args.email
          })) > 0
            ? "Email Already Exists"
            : null;
        return { errorList: [userError, emailError] };
      }
      await mailService.sendEmail("CONFIRM", {
        toFName: args.firstName,
        toLName: args.lastName,
        toEmail: args.email,
        code: args.validationCode
      });
      return { User: user };
    },

    login: async(placeHolder, args) => {
      try {
        const user = await User.findOne({ username: args.username.toLowerCase() });

        if (!await bcrypt.compare(args.password, user.password)) {
          return { errorList: "Username or Password is incorrect" };
        }
        else if(!user.confirmed){
          return { errorList: "Please confirm your email address to login" };
        }
        const userSign = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          confirmed: user.confirmed
        };
        return { User: user, Token: jwt.sign(userSign, JWT_SECRET_KEY) };
      } catch (error) {
        return { errorList: "Username or Password is incorrect" };
      }
    },

    validateAccount: async(placeholder, args)=>{
      const user = await User.findOne({email: args.email})
      if(user.validationCode!=args.validationCode.trim()){
        return "Invalid Validation Code"
      }
      else{
        await User.findByIdAndUpdate(user._id,{validationCode: null, confirmed: true})
        return "Account verified"
      }
    }
  }
};

const server = new ApolloServer({
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
  }
});

const app = express();
app.use(cors());
app.use("/", express.static(__dirname + "/../client/"));
app.get("/", function(response) {
  response.sendFile(path.join(__dirname + "/../client/index.html"));
});
server.applyMiddleware({ app });


const port = process.env.PORT || 4000;

app.listen({ port }, () =>
  console.log(
    `Client application ready at http:localhost:${port},`,
    `Backend server ready at http:localhost:${port}${server.graphqlPath}`
  )
);
