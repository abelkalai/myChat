import React, { useState, useEffect } from "react";
import ChatSearch from "./left/ChatSearch";
import ChatDisplay from "./right/ChatDisplay";
import { useHistory, useParams } from "react-router-dom";
import { GET_CONVERSATIONS } from "GraphqlDocuments/conversation";
import { useQuery } from "@apollo/react-hooks";
import "MainStylesheets/chat/chat.css";

const ChatContainer = (props) => {
  const [currentConvo, setCurrentConvo] = useState(null);
  const [currentChat, setCurrentChat] = useState("");
  const [mobileDisplay, setMobileDisplay] = useState("search");
  const [badUserID, setBadUserID] = useState(false);
  const routerHistory = useHistory();
  const { id } = useParams();
  const[userLoading, setUserLoading] = useState(true)
  const getConvoQuery = useQuery(GET_CONVERSATIONS, {
    variables: { _id: props.userInfo._id },
  });
  useEffect(() => {
    if (badUserID && id===undefined) {
      setBadUserID(false);
      setUserLoading(true)
    }
  }, [id]);
  useEffect(() => {
    if (!getConvoQuery.loading) {
      if (getConvoQuery.data.getConversations.length > 0 && id === undefined) {
        const contactId =
          getConvoQuery.data.getConversations[0].members[0]._id !=
          props.userInfo._id
            ? getConvoQuery.data.getConversations[0].members[0]._id
            : getConvoQuery.data.getConversations[0].members[1]._id;
        setCurrentChat(contactId);
        setCurrentConvo(getConvoQuery.data.getConversations[0]._id);
        routerHistory.replace(`/home/messages/${contactId}`);
      } else if (id != undefined) {
        setCurrentChat(id);
        let userInConvoHistory = getConvoQuery.data.getConversations.filter(
          (convo) =>
            convo.members.filter((member) => member._id === id).length > 0
        );
        setCurrentConvo(
          userInConvoHistory.length > 0 ? userInConvoHistory[0]._id : null
        );
      }
    }
  }, [getConvoQuery, id]);

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
        badUserID={badUserID}
        setBadUserID={setBadUserID}
        paramID={id}
        userLoading={userLoading}
        setUserLoading={setUserLoading}
      />
    </div>
  );
};

export default ChatContainer;
