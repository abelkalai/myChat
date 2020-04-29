import React, { useState } from "react";
import ChatSearch from "./left/ChatSearch";
import ChatDisplay from "./right/ChatDisplay";
import { GET_CONVERSATIONS } from "GraphqlDocuments/conversation";
import { useQuery } from "@apollo/react-hooks";
import "MainStylesheets/chat.css";

const ChatContainer = (props) => {
  const [currentConvo, setCurrentConvo] = useState(null);
  const [currentChat, setCurrentChat] = useState("");
  const [mobileDisplay, setMobileDisplay] = useState("search");
  const getConvoQuery = useQuery(GET_CONVERSATIONS, {
    variables: { _id: props.userInfo._id },
    onCompleted: (data) => {
      if (data.getConversations.length > 0) {
        setCurrentChat(
          data.getConversations[0].members[0]._id != props.userInfo._id
            ? data.getConversations[0].members[0]._id
            : data.getConversations[0].members[1]._id
        );
        setCurrentConvo(data.getConversations[0]._id);
      }
    },
  });

  return (
    <div className="chat-main">
      <ChatSearch
        userInfo={props.userInfo}
        setCurrentChat={setCurrentChat}
        getConvoQuery={getConvoQuery}
        currentConvo={currentConvo}
        setCurrentConvo={setCurrentConvo}
        windowWidth={props.windowWidth}
        mobileDisplay={mobileDisplay}
        setMobileDisplay={setMobileDisplay}
      />

      <ChatDisplay
        userInfo={props.userInfo}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        convoHistory={getConvoQuery}
        currentConvo={currentConvo}
        setCurrentConvo={setCurrentConvo}
        windowWidth={props.windowWidth}
        mobileDisplay={mobileDisplay}
        setMobileDisplay={setMobileDisplay}
      />
    </div>
  );
};

export default ChatContainer;
