import React, { useState } from "react";
import ChatSearch from "./ChatSearch";
import ChatDisplay from "./ChatDisplay";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../../../../assets/stylesheets/components/main/chat.css";

const GET_CONVERSATIONS = gql`
  query getConversations($_id: String!) {
    getConversations(_id: $_id) {
      _id
      members {
        _id
        fullName
        profilePicture
      }
      lastSender
      lastMessage
      lastMessageTime
      unread
      sender {
        fullName
      }
      change
    }
  }
`;

const ChatContainer = props => {
  const [fromSearch, setFromSearch] = useState(false);
  const [currentConvo, setCurrentConvo] = useState(null);
  const [currentChat, setCurrentChat] = useState("");
  const getConvoQuery = useQuery(GET_CONVERSATIONS, {
    variables: { _id: props.userInfo._id }
  });
  
  return (
    !getConvoQuery.loading && (
      <div className="chat-main">
        {
          <ChatSearch
            userInfo={props.userInfo}
            setCurrentChat={setCurrentChat}
            getConvoQuery={getConvoQuery}
            setFromSearch={setFromSearch}
            currentConvo={currentConvo}
            setCurrentConvo={setCurrentConvo}
          />
        }
        {
          <ChatDisplay
            userInfo={props.userInfo}
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            fromSearch={fromSearch}
            setFromSearch={setFromSearch}
            convoHistory={getConvoQuery}
            getConversations={GET_CONVERSATIONS}
            currentConvo={currentConvo}
            setCurrentConvo={setCurrentConvo}
          />
        }
      </div>
    )
  );
};

export default ChatContainer;
