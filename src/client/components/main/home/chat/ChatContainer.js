import React, { useState } from "react";
import ChatSearch from "./left/ChatSearch";
import ChatDisplay from "./right/ChatDisplay";
import {GET_CONVERSATIONS} from "GraphqlDocuments/conversation"
import { useQuery } from "@apollo/react-hooks";
import ChatDisplayPlaceholder from "./right/placeholders/ChatDisplayPlaceholder";
import "MainStylesheets/chat.css";

const ChatContainer = (props) => {
  const [fromSearch, setFromSearch] = useState(false);
  const [currentConvo, setCurrentConvo] = useState(null);
  const [currentChat, setCurrentChat] = useState("");
  const [messageLoading, setMessageLoading] = useState(true);
  const [aboutLoading, setAboutLoading] = useState(true);
  const getConvoQuery = useQuery(GET_CONVERSATIONS, {
    variables: { _id: props.userInfo._id },
  });

  return (
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

      {(getConvoQuery.loading || messageLoading || aboutLoading) && (
        <ChatDisplayPlaceholder />
      )}
      <ChatDisplay
        userInfo={props.userInfo}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        fromSearch={fromSearch}
        setFromSearch={setFromSearch}
        convoHistory={getConvoQuery}
        currentConvo={currentConvo}
        setCurrentConvo={setCurrentConvo}
        messageLoading={messageLoading}
        setMessageLoading={setMessageLoading}
        aboutLoading={aboutLoading}
        setAboutLoading={setAboutLoading}
      />
    </div>
  );
};

export default ChatContainer;
