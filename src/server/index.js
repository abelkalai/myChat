const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const User = require("./models/user");
const config = require("../../utils/config");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { merge } = require("lodash");

const MONGODB_URI = config.MONGODB_URI;
const JWT_SECRET_KEY = config.JSON_SECRET_KEY;
const { userTypeDefs, userResolvers } = require("./schema/user");
const { messageTypeDefs, messageResolvers } = require("./schema/message");
const {
  conversationTypeDefs,
  conversationResolvers,
} = require("./schema/conversation");

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Couldn't connect to MongoDB see error:", error.message);
  });

//Fix mongoose methods
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const apolloServer = new ApolloServer({
  typeDefs: [userTypeDefs, messageTypeDefs, conversationTypeDefs],
  resolvers: merge(userResolvers, messageResolvers, conversationResolvers),
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

/* Enable Path Shortcuts*/
app.use("/logos", express.static(__dirname + "/../client/assets/logos"));
app.use("/images", express.static(__dirname + "/../client/assets/images"));

app.use("/", express.static(__dirname + "/../client/"));
app.get("/", function (response) {
  response.sendFile(path.join(__dirname + "/../client/index.html"));
});

apolloServer.applyMiddleware({ app });

const port = process.env.PORT || 4000;
const httpServer = createServer(app);

apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen({ port });
