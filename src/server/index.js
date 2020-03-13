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

const mailService = require("./services/emailService");

const sendMail = async () => {
  await mailService.sendEmail("CONFIRM", "Adam", "Belk", "abelkalai@gmail.com");
};

//sendMail()

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
    confirmed: Boolean!
  }

  type addUserResp {
    User: User
    errorList: [String]
  }

  type Query {
    allUsers: [User!]!
    loggedIn: User
    checkEmail(email: String): String
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

    checkEmail: (placeHolder, args) => {
      return User.collection
        .countDocuments({ email: args.email })
        .then(result => (result > 0 ? "validEmail" : "No associated email found"))
      
    }
  },
  Mutation: {
    addUser: async (placeHolder, args) => {
      args.password = await bcrypt.hash(args.password, 10);
      args.confirmed = false;
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

    login: (placeHolder, args) => {
      try {
        const user = User.find({ username: args.username });

        if (!(bcrypt.compare(args.password, user[0].password))) {
          return { errorList: "Username or Password is incorrect" };
        }
        const userSign = {
          _id: user[0]._id,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          email: user[0].email,
          confirmed: user[0].confirmed
        };
        return { User: user[0], Token: jwt.sign(userSign, JWT_SECRET_KEY) };
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
