const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const { merge } = require("lodash");
const { userTypeDefs, userResolvers } = require("./schema/userSchema");
const { messageTypeDefs, messageResolvers } = require("./schema/messageSchema");
const {
  conversationTypeDefs,
  conversationResolvers,
} = require("./schema/conversationSchema");
const User = require("./models/user");
const config = require("../../config");

const MONGODB_URI = config.MONGODB_URI;
const JWT_SECRET_KEY = config.JSON_SECRET_KEY;

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
app.use(cors());
app.use(express.json({limit: '50mb'}));
const path = require("path");

/* Enable Path Shortcuts*/
app.use("/logos", express.static(__dirname + "/../client/assets/logos"));
app.use("/images", express.static(__dirname + "/../client/assets/images"));
app.use("/gifs", express.static(__dirname + "/../client/assets/gifs"));

app.use("/", express.static(__dirname + "/../client/"));
app.get("/", function (response) {
  response.sendFile(path.join(__dirname + "/../client/index.html"));
});

apolloServer.applyMiddleware({ app });

const httpServer = createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 3000;
httpServer.listen({ port }, () =>  
  console.log(
  `Client application ready at http:localhost:${port} |`,
  `Backend server ready at http:localhost:${port}${apolloServer.graphqlPath}` 
  )
);
