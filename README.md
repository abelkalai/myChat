# MyChat

[Live Now!](https://mychat-abelkalai.herokuapp.com)

## About

Connect with friends and family to message one another in real time either on desktop or mobile. MyChat enables connections for all!

## Technologies

* [React.js](https://reactjs.org/) on frontend for a single page application
* [NodeMailer](https://nodemailer.com/about/) to send emails for account management
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/efficiency?utm_source=google&utm_campaign=gs_americas_united_states_search_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=1718986498&gclid=CjwKCAiAq8f-BRBtEiwAGr3DgZvLHOpdKVa8PSEAWaoJXtMIYoaCBmqXo9VTRVxG1ChrV9X4dwHYxRoC108QAvD_BwE) for the database
* [GraphQL](https://graphql.org/) for data querying and manipulation
* [Express.js](https://expressjs.com/) leveraged for the web server

## Features

### GraphQL Subscriptions

To update messages in real time, MyChat makes use of [GraphQL](https://graphql.org/) ``subscriptions`` via WebSockets.

![messagingDemo](/src/client/assets/gifs/messagingDemo.gif)

On the clientside, the ``subscriptions`` will listen for additional messages being passed to ``MongoDB`` and if any messages are to the user, they are updated on the page!

```javascript
useSubscription(NEW_MESSAGE, {
    fetchPolicy: "no-cache",
    onSubscriptionData: ({ subscriptionData }) => {
      updateMsgCache(subscriptionData.data.newMessage);
    },
});

useSubscription(UPDATED_CONVO, {
    fetchPolicy: "no-cache",
    onSubscriptionData: ({ subscriptionData }) => {
      updateConvoCache(subscriptionData.data.updatedConvo);
    },
});

```

### Mobile Responsiveness

To let mobile users chat with one another, MyChat uses ``CSS Media Queries`` to adjust to different screen sizes. For mobile users, the main chat page works more like a messaging app.

![mobileResponsivenessDemo](/src/client/assets/gifs/mobileResponsivenessDemo.gif)

### Account Creation & Mangament

MyChat's account creation & management are built from the ground up using password hashing and [NodeMailer](https://nodemailer.com/about/). User accounts are tied to their emails and can be used to retrieve credentials such as usernames or passwords.

![forgotPasswordDemo](/src/client/assets/gifs/forgotPasswordDemo.gif)
![forgotPasswordEmailDemo](/src/client/assets/images/forgotPasswordEmailDemo.JPG)

### Customizable Profile

MyChat lets users personalize their profiles. Users can change their bios and upload profile pictures. Pictures are compressed to save size and stored as ``Base64`` strings.

![editProfileDemo](/src/client/assets/gifs/editProfileDemo.gif)

## Future Plans

* Group Messaging
* Search messages for keywords
* Send images, gifs and emojis over chat
