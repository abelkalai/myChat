import React, { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  useApolloClient,
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/react-hooks";
import { GET_USER } from "GraphqlDocuments/userDocs";
import {
  GET_MESSAGES,
  NEW_MESSAGE,
  READ_MESSAGE,
  SEND_MESSAGE,
} from "GraphqlDocuments/messageDocs";
import {
  GET_CONVERSATIONS,
  UPDATED_CONVO,
} from "GraphqlDocuments/conversationDocs";
import { useFieldInput } from "Utilities/customHooks";
import ChatDisplayPlaceholder from "./placeholders/ChatDisplayPlaceholder";
import Messages from "./Messages";
import About from "./About";
import "HomePageStylesheets/chat/chatDisplay.css";

const ChatDisplay = (props) => {
  const [fromAbout, setFromAbout] = useState(false);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [readMsg] = useMutation(READ_MESSAGE, {
    update: (store, { data }) => {
      let copy = [...props.getConvosQuery.data.getConversations];
      let newConvos = copy.map((convo) =>
        convo._id === data.readMessage ? { ...convo, unread: false } : convo
      );
      store.writeQuery({
        query: GET_CONVERSATIONS,
        variables: { _id: props.userInfo._id },
        data: { getConversations: newConvos },
      });
    },
  });

  const getMessages = useQuery(GET_MESSAGES, {
    variables: { senderID: props.userInfo._id, receiverID: props.currentChat },
    fetchPolicy: "cache-and-network",
    skip: props.getConvosQuery.loading
  });

  const getUser = useQuery(GET_USER, {
    variables: { _id: props.currentChat, myID: props.userInfo._id },
    skip: !props.currentChat || props.getConvosQuery.loading,
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (!data.getUser) {
        props.setBadUserID(true);
      } else {
        props.setUserLoading(false);
      }
    },
  });

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

  const messageField = useFieldInput("");
  const apolloClient = useApolloClient();

  const updateMsgCache = (newMsg) => {
    if (
      (newMsg.senderID === props.userInfo._id ||
        newMsg.receiverID === props.userInfo._id) &&
      newMsg.conversationID === props.currentConvo
    ) {
      let newMsgArray = [];
      if (getMessages.data.getMessages) {
        newMsgArray = [...getMessages.data.getMessages];
      }
      let scrollToBottom = false;
      const messages = document.getElementById("messages");
      if (messages != null) {
        if (
          messages.scrollTop ===
          messages.scrollHeight - messages.offsetHeight
        ) {
          scrollToBottom = true;
        }
      }
      newMsgArray.unshift(newMsg);
      apolloClient.writeQuery({
        query: GET_MESSAGES,
        variables: {
          senderID: props.userInfo._id,
          receiverID: props.currentChat,
        },
        data: { getMessages: newMsgArray },
      });
      if (scrollToBottom) {
        messages.scrollTop = messages.scrollHeight;
      }
    }
  };

  const updateConvoCache = async (convo) => {
    if (
      convo.members.filter((member) => member._id === props.userInfo._id)
        .length != 0
    ) {
      if (props.currentConvo === null) props.setCurrentConvo(convo._id);
      const messages = document.getElementById("messages");
      if (
        document.activeElement.id === "message-form-text-field" &&
        convo._id === props.currentConvo &&
        convo.lastSender != props.userInfo._id &&
        messages.scrollTop === messages.scrollHeight - messages.offsetHeight
      ) {
        convo.unread = false;
        await readMsg({ variables: { _id: convo._id } });
      }
      let copy = [...props.getConvosQuery.data.getConversations];
      copy = copy.filter((x) => x._id != convo._id);
      copy.unshift(convo);
      apolloClient.writeQuery({
        query: GET_CONVERSATIONS,
        variables: { _id: props.userInfo._id },
        data: { getConversations: copy },
      });
    }
  };

  const sendMessageEvent = async (event) => {
    event.preventDefault();
    if (messageField.value) {
      let senderID = props.userInfo._id;
      let receiverID = props.currentChat;
      let content = messageField.value;
      await sendMessage({ variables: { senderID, receiverID, content } });
      messageField.clear();
    }
  };

  const readMessage = async (event) => {
    event.preventDefault();
    let currentChatID = props.getConvosQuery.data.getConversations.filter(
      (convo) => convo._id === props.currentConvo
    );
    if (currentChatID.length != 0) {
      if (currentChatID[0].lastSender != props.userInfo._id) {
        await readMsg({ variables: { _id: props.currentConvo } });
      }
    }
  };

  const chatWindow = () => {
    return (
      <div id="chat-window">
        <Messages
          getMessages={getMessages}
          userInfo={props.userInfo}
          currentChat={props.currentChat}
          setMobileDisplay={props.setMobileDisplay}
          getUser={getUser}
          windowWidth={props.windowWidth}
          fromAbout={fromAbout}
          setFromAbout={setFromAbout}
        />
        <form id="message-form" autoComplete="off" onSubmit={sendMessageEvent}>
          <input
            id="message-form-text-field"
            type="text"
            value={messageField.value}
            onClick={readMessage}
            onChange={messageField.onChange}
            placeholder="Type a message..."
          />
          <input id="message-form-img" type="image" src="images/send.png" />
        </form>
      </div>
    );
  };

  return (
    <div id={props.windowWidth > 768 ? "chat-display" : null}>
      {props.badUserID && <Redirect to="/home/messages" />}
      {props.userLoading ? (
        <ChatDisplayPlaceholder
          getConvosQuery={props.getConvosQuery}
          windowWidth={props.windowWidth}
        />
      ) : (
        <Fragment>
          {(props.windowWidth > 768 || props.mobileDisplay === "chatWindow") &&
            chatWindow()}
          {(props.windowWidth > 768 || props.mobileDisplay === "about") && (
            <About
              getUser={getUser}
              setMobileDisplay={props.setMobileDisplay}
              windowWidth={props.windowWidth}
              setFromAbout={setFromAbout}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ChatDisplay;
