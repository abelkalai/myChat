import React, { useState } from "react";
import ChatSearch from "./ChatSearch";
import ChatDisplay from "./ChatDisplay"
import "../../../../assets/stylesheets/components/main/chat.css";

const ChatContainer = props => {
  const [currentChat, setCurrentChat] = useState("")
  return (
    <div className="chat-main">
      {<ChatSearch userInfo={props.userInfo} setCurrentChat={setCurrentChat}/>}
      {<ChatDisplay userInfo={props.userInfo} currentChat={currentChat}/>}
    </div>
  );
};

export default ChatContainer;
