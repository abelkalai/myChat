const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server");
const User = require("./models/user");
const config = require("./utils/config");

const MONGODB_URI = config.MONGODB_URI;

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

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      username: String!
      password: String!
    ): addUserResp
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
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Backend Server at this URL: ${url}`);
});
