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
  const getConvosQuery = useQuery(GET_CONVERSATIONS, {
    variables: { _id: props.userInfo._id },
    fetchPolicy: "network-only",
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
    if (!getConvosQuery.loading) {
      if (getConvosQuery.data.getConversations.length > 0 && paramId === undefined) {
        const contactId =
          getConvosQuery.data.getConversations[0].members[0]._id !=
          props.userInfo._id
            ? getConvosQuery.data.getConversations[0].members[0]._id
            : getConvosQuery.data.getConversations[0].members[1]._id;
        setCurrentChat(contactId);
        setCurrentConvo(getConvosQuery.data.getConversations[0]._id);
        browserHistory.replace(`/home/messages/${contactId}`);
      } else if (paramId != undefined) {
        setCurrentChat(paramId);
        let userInConvoHistory = getConvosQuery.data.getConversations.filter(
          (convo) =>
            convo.members.filter((member) => member._id === paramId).length > 0
        );
        setCurrentConvo(
          userInConvoHistory.length > 0 ? userInConvoHistory[0]._id : null
        );
      }
    }
  }, [getConvosQuery, paramId]);

  return (
    <div id="chat-container">
      <Search
        userInfo={props.userInfo}
        getConvosQuery={getConvosQuery}
        currentConvo={currentConvo}
        windowWidth={props.windowWidth}
        mobileDisplay={mobileDisplay}
        setMobileDisplay={setMobileDisplay}
      />

      <ChatDisplay
        userInfo={props.userInfo}
        currentChat={currentChat}
        getConvosQuery={getConvosQuery}
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
