const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const User = require("./models/user");
const config = require("./utils/config");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MONGODB_URI = config.MONGODB_URI;
const JWT_SECRET_KEY = config.JSON_SECRET_KEY;

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
    loggedInUser: User
  }

  type loginResp {
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
  }
`;

const resolvers = {
  Query: {
    allUsers: () => {
      return User.find({});
    }
  },
  Mutation: {
    addUser: async (placeHolder, args) => {
      args.password=await bcrypt.hash(args.password, 10)
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
      try {
        const user = await User.find({ username: args.username });
        if (!await bcrypt.compare(args.password, user[0].password)) {
          return { errorList: "Username or Password is incorrect" };
        }
        const userSign = {
          _id: user[0]._id,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          email: user[0].email
        };
        return {
          Token: jwt.sign(userSign, JWT_SECRET_KEY)
        };
      } catch (error) {
        return { errorList: "Username or Password is incorrect" };
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET_KEY);
      const currentUser = await User.findById(decodedToken._id);
      return { currentUser };
    }
  }
});


const app = express();
app.use(cors());
app.use('/',express.static(__dirname+'/../client/'))
app.get('/',function(response){
  response.sendFile(path.join(__dirname+'/../client/index.html'))
})
server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000

app.listen({ port: PORT }, () =>
  console.log(
    `Client application ready at http:localhost:${PORT}`,
    `Backend server ready at http:localhost:${PORT,server.graphqlPath}`
  )
);

