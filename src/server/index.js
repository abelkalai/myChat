const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const User = require("./models/user");
const config = require("./utils/config");
const express = require('express')
const cors = require('cors')
const MONGODB_URI = config.MONGODB_URI;
const JWT_SECRET_KEY = config.JSON_SECRET_KEY;
const bcrypt = require('bcryptjs')
const JWT = require("jsonwebtoken");

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

const typeDefs = gql`
  type User {
    _id: String!
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    password: String!
  }

  type addUserResp {
    User: User
    errorList: [String]
  }

  type Query {
    allUsers: [User!]!
  }

  type loginResp {
    Token: String!
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
  }
`;

const resolvers = {
  Query: {
    allUsers: () => {
      return User.find({});
    }
  },
  Mutation: {
    addUser: async (placeHolder, args, response) => {
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

      return { User: user };
    },

    login: async (placeHolder, args) => {
      const user = await User.find({ username: args.username });
      if (user[0].password != args.password) {
        return { errorList: "Username or Password is incorrect" };
      }

      const userSign = {
        _id: user[0]._id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email
      };

      return {
        Token: JWT.sign(userSign, JWT_SECRET_KEY)
      };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express()
app.use(cors())
server.applyMiddleware({app})

app.listen({port: 4000}, ()=>
  console.log(`Backend server ready at http:localhost:4000${server.graphqlPath}`)
)
// server.listen().then(({ url }) => {
//   console.log(`Backend Server at this URL: ${url}`);
// });
