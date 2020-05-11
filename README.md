# My Chat

[Live Now!](https://lit-reaches-10392.herokuapp.com/)

## About

Connect with friends and family to message one another in real time either on desktop or mobile. MyChat enables connections for all!

## Technologies

* React for the frontend for a single page application
* NodeMailer to send emails for account management
* MongoDB for the database
* GraphQL for data querying and manipulation
* Express for the web server

## Features

### Subscriptions

To update messages in real time, MyChat makes use of subscriptions via WebSockets.

![messagingDemo](/src/client/assets/gifs/messagingDemo.gif)

On the clientside, the subscriptions will listen for additional messages being passed to MongoDB and if any messages are to the user, they are updated on the page!

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

To let mobile users chat with one another, MyChat uses CSS media queries to adjust to different screen sizes. For mobile users, the main chat page works more like a messaging app.

![mobileResponsiveDemo](/src/client/assets/gifs/mobileResponsiveDemo.gif)


### Account Creation & Mangament

MyChat's account creation & management are built from the ground up using password hashing and NodeMailer. User accounts are tied to their emails and this can be used if users forgot their password.

![forgotPasswordDemo](/src/client/assets/gifs/forgotPasswordDemo.gif)
![forgotPasswordEmailDemo](/src/client/assets/images/forgotPasswordEmailDemo.JPG)

### Customizable Profile

MyChat lets users personalize their profiles. Users can change their bios and upload profile pictures. Pictures are compressed to save size and stored as base64 strings.

![editProfileDemo](/src/client/assets/gifs/editProfileDemo.gif)
## Future Plans

- Group Messaging
- Search messages for keywords
- Send images, gifs and emojis over chat