import React, { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
import { useFieldInput } from "Hooks/customHooks";
import {
  useApolloClient,
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/react-hooks";

import { GET_USER } from "GraphqlDocuments/user";
import {
  GET_MESSAGES,
  NEW_MESSAGE,
  READ_MESSAGE,
  SEND_MESSAGE,
} from "GraphqlDocuments/message";
import {
  GET_CONVERSATIONS,
  UPDATED_CONVO,
} from "GraphqlDocuments/conversation";

import ChatDisplayPlaceholder from "./placeholders/ChatDisplayPlaceholder";
import ChatMessage from "./ChatMessage";
import About from "./About";
import "MainStylesheets/chat/chatDisplay.css";

const ChatDisplay = (props) => {
  const apolloClient = useApolloClient();
  const messageField = useFieldInput("");
  const [sendMessageQuery] = useMutation(SEND_MESSAGE);
  const [readMsg] = useMutation(READ_MESSAGE, {
    update: (store, { data }) => {
      let convoCache = store.readQuery({
        query: GET_CONVERSATIONS,
        variables: { _id: props.userInfo._id },
      });
      let copy = [...convoCache.getConversations];
      copy = copy.map((convo) =>
        convo._id === data.readMessage ? { ...convo, unread: false } : convo
      );
      store.writeQuery({
        query: GET_CONVERSATIONS,
        variables: { _id: props.userInfo._id },
        data: { getConversations: copy },
      });
    },
  });

  const getMessages = useQuery(GET_MESSAGES, {
    variables: { senderID: props.userInfo._id, receiverID: props.currentChat },
    skip: props.convoHistory.loading
  });
  const getUser = useQuery(GET_USER, {
    variables: { _id: props.currentChat, myID: props.userInfo._id },
    skip: !props.currentChat || props.convoHistory.loading,
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

  const updateMsgCache = (newMsg) => {
    if (
      (newMsg.senderID === props.userInfo._id ||
        newMsg.receiverID === props.userInfo._id) &&
      newMsg.conversationID === props.currentConvo
    ) {
      const msgStore = apolloClient.readQuery({
        query: GET_MESSAGES,
        variables: {
          senderID: props.userInfo._id,
          receiverID: props.currentChat,
        },
      });
      let scrollToBottom = false;
      const messageContainer = document.getElementById("messageContainer");
      if (
        messageContainer.scrollTop ===
        messageContainer.scrollHeight - messageContainer.offsetHeight
      ) {
        scrollToBottom = true;
      }
      let newMsgArray = [...msgStore.getMessages];
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
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }
  };

  const updateConvoCache = async (convo) => {
    if (
      convo.members.filter((member) => member._id === props.userInfo._id)
        .length != 0
    ) {
      if (props.currentConvo === null) props.setCurrentConvo(convo._id);
      const messageContainer = document.getElementById("messageContainer");
      if (
        document.activeElement.id === "messageInput" &&
        convo._id === props.currentConvo &&
        convo.lastSender != props.userInfo._id &&
        messageContainer.scrollTop ===
          messageContainer.scrollHeight - messageContainer.offsetHeight
      ) {
        convo.unread = false;

        await readMsg({ variables: { _id: convo._id } });
      }
      const convoStore = apolloClient.readQuery({
        query: GET_CONVERSATIONS,
        variables: { _id: props.userInfo._id },
      });
      let copy = [...convoStore.getConversations];
      copy = copy.filter((x) => x._id != convo._id);

      copy.unshift(convo);

      apolloClient.writeQuery({
        query: GET_CONVERSATIONS,
        variables: { _id: props.userInfo._id },
        data: { getConversations: copy },
      });
    }
  };
  const sendMessage = async (event) => {
    event.preventDefault();
    if (messageField.value) {
      let senderID = props.userInfo._id;
      let receiverID = props.currentChat;
      let content = messageField.value;

      await sendMessageQuery({ variables: { senderID, receiverID, content } });
      messageField.clear();
    }
  };

  const readMessage = async (event) => {
    event.preventDefault();
    let currentChat = props.convoHistory.data.getConversations.filter(
      (convo) => convo._id === props.currentConvo
    );
    if (currentChat.length != 0) {
      if (currentChat[0].lastSender != props.userInfo._id) {
        await readMsg({ variables: { _id: props.currentConvo } });
      }
    }
  };

  const chat = () => {
    return (
      <div className="chat-display-chat-parent">
        <ChatMessage
          getMessages={getMessages}
          userInfo={props.userInfo}
          currentChat={props.currentChat}
        />

        <form
          onSubmit={sendMessage}
          className="chat-display-chat-send-message-form"
        >
          <input
            id="messageInput"
            type="text"
            className="chat-display-chat-message-field"
            value={messageField.value}
            onClick={readMessage}
            onChange={messageField.onChange}
            placeholder="Type a message..."
          />
          <input
            className="chat-display-chat-send-message-form-img "
            type="image"
            src="images/send.png"
          />
        </form>
      </div>
    );
  };

  return (
    <div className="chat-display-parent">
      {props.badUserID && <Redirect to="/home/messages" />}
      {props.userLoading ? (
        <ChatDisplayPlaceholder convoHistory={props.convoHistory} />
      ) : (
        <Fragment>
          {(props.windowWidth > 768 || props.mobileDisplay === "chat") &&
            chat()}
          {(props.windowWidth > 768 || props.mobileDisplay === "about") && (
            <About getUser={getUser} />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ChatDisplay;
