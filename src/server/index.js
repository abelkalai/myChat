const mongoose = require("mongoose");
const { ApolloServer, UserInputError, gql } = require("apollo-server");
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
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    password: String!
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
    ): User
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
      const user = new User({ ...args });
      console.log(user);
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
      return user;
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
