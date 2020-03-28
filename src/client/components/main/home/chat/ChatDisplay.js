import React, { useState } from "react";
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

const ChatDisplay = props => {
  const getUser = useQuery(GET_SINGLE_USER, {
    variables: { _id: props.currentChat }
  });
  // const [noChatHistory, setNoChatHistory] = useState(props.currentChat === "" ? true : false);

  const chat = () => {
    return (
      <div className="chat-display-chat">
        Right Middle Panel Placeholder
        <form>
          <input placeholder="Type a message..." />
          <img src="../../../../assets/images/send.png" />
        </form>
      </div>
    );
  };

  const about = () => {
    return (
      <div className="chat-display-about">
        <h1>{getUser.data.getSingleUser.fullName}</h1>
        <img src={`data:image/png;base64,${getUser.data.getSingleUser.profilePicture}`}/>
        <h2>About </h2>
        <p>{getUser.data.getSingleUser.about}</p>
      </div>
    );
  };

  const defaultChatDisplay = () => {
    return (
      <div className="chat-display-default">
        <h1>Hi, welcome to MyChat</h1>
        <p>
          To get started, enter a name from the contact list to the left to
          start messaging!
        </p>
      </div>
    );
  };
  return (!getUser.loading &&(
    <div>
      {props.currentChat === "" && defaultChatDisplay()}
      <div className="chat-display-parent">
        {props.currentChat != "" && chat()}
        {props.currentChat != "" && about()}
      </div>
    </div>
  ));
};

export default ChatDisplay;
