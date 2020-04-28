import React, { useEffect } from "react";
import { useFieldInput } from "Hooks/customHooks";
import {
  useApolloClient,
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/react-hooks";

import ChatMessage from "./ChatMessage";
import About from "./About";
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

const ChatDisplay = (props) => {
  if (props.convoHistory.loading) {
    return null;
  }

  useEffect(() => {
    if (
      props.convoHistory.data.getConversations.length != 0 &&
      !props.currentChat
    ) {
      for (let ele of props.convoHistory.data.getConversations[0].members) {
        if (ele._id != props.userInfo._id) props.setCurrentChat(ele._id);
      }
      props.setCurrentConvo(props.convoHistory.data.getConversations[0]._id);
    }
  },[props.convoHistory,props.currentChat]);

  const messageField = useFieldInput("");

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

  const [sendMessageQuery] = useMutation(SEND_MESSAGE);
  const getMessages = useQuery(GET_MESSAGES, {
    variables: { senderID: props.userInfo._id, receiverID: props.currentChat },
    onCompleted: () => {
      props.setMessageLoading(false);
    },
  });
  const getUser = useQuery(GET_USER, {
    variables: { _id: props.currentChat },
    onCompleted: () => {
      props.setAboutLoading(false);
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

  const apolloClient = useApolloClient();

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
      const messageContainer = document.getElementById("messageContainer");
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  };


  const updateConvoCache = async (convo) => {
    if (
      convo.members.filter((member) => member._id === props.userInfo._id)
        .length != 0
    ) {
      if (props.currentConvo === null) props.setCurrentConvo(convo._id);

      if (
        document.activeElement.id === "messageInput" &&
        convo._id === props.currentConvo &&
        convo.lastSender != props.userInfo._id
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
        <ChatMessage getMessages={getMessages} userInfo={props.userInfo} />
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
            className="chat-display-chat-message-image"
            type="image"
            src="images/send.png"
          />
        </form>
      </div>
    );
  };

  const defaultChatDisplay = () => {
    return (
      <div className="chat-display-default">
        <h1>Hi, Welcome to MyChat</h1>
        <p>
          To get started, enter a name from the contact list to the left to
          start messaging!
        </p>
      </div>
    );
  };

  return props.messageLoading || props.aboutLoading ? null : (
    <div className="chat-display-parent">
      {!props.currentChat &&
        props.convoHistory.data.getConversations.length === 0 &&
        defaultChatDisplay()}
      {props.currentChat && chat()}
      {props.currentChat && <About getUser={getUser} />}
    </div>
  );
};

export default ChatDisplay;
