import React, { useState, useEffect } from "react";
import { fieldInput } from "../../../hooks/customHooks";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_SINGLE_USER = gql`
  query getSingleUser($_id: String!) {
    getSingleUser(_id: $_id) {
      _id
      fullName
      profilePicture
      about
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($senderID: String!, $receiverID: String!) {
    getMessages(senderID: $senderID, receiverID: $receiverID) {
      _id
      senderID
      receiverID
      content
      time
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage(
    $senderID: String!
    $receiverID: String!
    $content: String!
  ) {
    sendMessage(senderID: $senderID, receiverID: $receiverID, content: $content)
  }
`;

const ChatDisplay = props => {
  useEffect(() => {
    if (props.convoHistory.data.getConversations.length != 0 && !props.fromSearch) {
      for (let ele of props.convoHistory.data.getConversations[0].members) {
        if (ele._id != props.userInfo._id) props.setCurrentChat(ele._id);
      }
    }
  });

  const messageField = fieldInput();
  const [sendMessageQuery] = useMutation(SEND_MESSAGE, {
    refetchQueries: [
      {
        query: GET_MESSAGES,
        variables: {
          senderID: props.userInfo._id,
          receiverID: props.currentChat
        }
      },
      {
        query: props.getConversations,
        variables: {
          _id: props.userInfo._id
        }
      }
    ]
  });
  const getMessages = useQuery(GET_MESSAGES, {
    variables: { senderID: props.userInfo._id, receiverID: props.currentChat }
  });
  const getUser = useQuery(GET_SINGLE_USER, {
    variables: { _id: props.currentChat }
  });

  const sendMessage = async event => {
    event.preventDefault();
    if (messageField === "") return;
    let senderID = props.userInfo._id;
    let receiverID = props.currentChat;
    let content = messageField.value;
    await sendMessageQuery({ variables: { senderID, receiverID, content } });
    messageField.clear();
  };

  const chat = () => {
    if (getMessages.loading || getMessages.data.getMessages === null) {
      return null;
    }
    return (
      <div className="chat-display-chat">
        {getMessages.data.getMessages.map(message =>
          message.senderID === props.userInfo._id ? (
            <div key={message._id} className="chat-message-wrapper">
              <span key={message._id} className="chat-my-message">
                {message.content}
              </span>
            </div>
          ) : (
            <div key={message._id} className="chat-message-wrapper">
              <span key={message._id} className="chat-contact-message">
                {message.content}
              </span>
            </div>
          )
        )}
        <form onSubmit={sendMessage}>
          <input
            type="text"
            className="chat-display-chat-message"
            value={messageField.value}
            onChange={messageField.onChange}
            placeholder="Type a message..."
          />
          <input type="image" src="../../../../assets/images/send.png" />
        </form>
      </div>
    );
  };

  const about = () => {
    if (getMessages.loading || getMessages.data.getMessages === null) {
      return null;
    }
    return (
      <div className="chat-display-about">
        <h1>{getUser.data.getSingleUser.fullName}</h1>
        <img
          src={`data:image/png;base64,${getUser.data.getSingleUser.profilePicture}`}
        />
        <h2>About </h2>
        <p>{getUser.data.getSingleUser.about}</p>
      </div>
    );
  };

  const defaultChatDisplay = () => {
    if (props.convoHistory.data.getConversations.length === 0) {
      return (
        <div className="chat-display-default">
          <h1>Hi, welcome to MyChat</h1>
          <p>
            To get started, enter a name from the contact list to the left to
            start messaging!
          </p>
        </div>
      );
    }
  };

  return (
    !getUser.loading && (
      <div>
        {props.currentChat === "" &&
          props.convoHistory.data.getConversations.length === 0 &&
          defaultChatDisplay()}
        <div className="chat-display-parent">
          {props.currentChat != "" && chat()}
          {props.currentChat != "" && about()}
        </div>
      </div>
    )
  );
};

export default ChatDisplay;
