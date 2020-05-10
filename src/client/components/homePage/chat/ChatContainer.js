import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_CONVERSATIONS } from "GraphqlDocuments/conversationDocs";
import Search from "./Search";
import ChatDisplay from "./ChatDisplay";
import "HomePageStylesheets/chat/chatContainer.css";

const ChatContainer = (props) => {
  const [currentConvo, setCurrentConvo] = useState(null);
  const [currentChat, setCurrentChat] = useState("");
  const [mobileDisplay, setMobileDisplay] = useState("search");
  const [badUserID, setBadUserID] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const getConvoQuery = useQuery(GET_CONVERSATIONS, {
    variables: { _id: props.userInfo._id },
  });
  const browserHistory = useHistory();
  const { paramId } = useParams();
  useEffect(() => {
    if (badUserID && paramId === undefined) {
      setBadUserID(false);
      setUserLoading(true);
    }
  }, [paramId]);
  useEffect(() => {
    if (!getConvoQuery.loading) {
      if (getConvoQuery.data.getConversations.length > 0 && paramId === undefined) {
        const contactId =
          getConvoQuery.data.getConversations[0].members[0]._id !=
          props.userInfo._id
            ? getConvoQuery.data.getConversations[0].members[0]._id
            : getConvoQuery.data.getConversations[0].members[1]._id;
        setCurrentChat(contactId);
        setCurrentConvo(getConvoQuery.data.getConversations[0]._id);
        browserHistory.replace(`/home/messages/${contactId}`);
      } else if (paramId != undefined) {
        setCurrentChat(paramId);
        let userInConvoHistory = getConvoQuery.data.getConversations.filter(
          (convo) =>
            convo.members.filter((member) => member._id === paramId).length > 0
        );
        setCurrentConvo(
          userInConvoHistory.length > 0 ? userInConvoHistory[0]._id : null
        );
      }
    }
  }, [getConvoQuery, paramId]);

  return (
    <div id="chat-container">
      <Search
        userInfo={props.userInfo}
        getConvoQuery={getConvoQuery}
        currentConvo={currentConvo}
        windowWidth={props.windowWidth}
        mobileDisplay={mobileDisplay}
        setMobileDisplay={setMobileDisplay}
      />

      <ChatDisplay
        userInfo={props.userInfo}
        currentChat={currentChat}
        convoHistory={getConvoQuery}
        currentConvo={currentConvo}
        setCurrentConvo={setCurrentConvo}
        windowWidth={props.windowWidth}
        mobileDisplay={mobileDisplay}
        setMobileDisplay={setMobileDisplay}
        badUserID={badUserID}
        setBadUserID={setBadUserID}
        userLoading={userLoading}
        setUserLoading={setUserLoading}
      />
    </div>
  );
};

export default ChatContainer;
