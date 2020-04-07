import React, { useEffect } from "react";
import { useFieldInput } from "../../../hooks/customHooks";
import {
  useApolloClient,
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ChatMessage from "./ChatMessage";

const GET_SINGLE_USER = gql`
  query getSingleUser($_id: String!) {
    getSingleUser(_id: $_id) {
      _id
      fullName
      profilePicture
      about
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($senderID: String!, $receiverID: String!) {
    getMessages(senderID: $senderID, receiverID: $receiverID) {
      _id
      conversationID
      senderID
      receiverID
      content
      time
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription {
    newMessage {
      _id
      conversationID
      senderID
      receiverID
      content
      time
    }
  }
`;

const UPATED_CONVO = gql`
  subscription {
    updatedConvo {
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
    }
  }
`;

const READ_MESSAGE = gql`
  mutation readMessage($_id: String!) {
    readMessage(_id: $_id)
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage(
    $senderID: String!
    $receiverID: String!
    $content: String!
  ) {
    sendMessage(senderID: $senderID, receiverID: $receiverID, content: $content)
  }
`;

const ChatDisplay = (props) => {
  useEffect(() => {
    if (
      props.convoHistory.data.getConversations.length != 0 &&
      props.currentChat === ""
    ) {
      for (let ele of props.convoHistory.data.getConversations[0].members) {
        if (ele._id != props.userInfo._id) props.setCurrentChat(ele._id);
      }
      props.setCurrentConvo(props.convoHistory.data.getConversations[0]._id);
    }
  });

  const messageField = useFieldInput()

  const [readMsg] = useMutation(READ_MESSAGE, {
    update: (store, { data }) => {
      let convoCache = store.readQuery({
        query: props.getConversations,
        variables: { _id: props.userInfo._id },
      });
      let copy = [...convoCache.getConversations]
      copy = copy.map(
        convo => convo._id === data.readMessage ? {...convo, "unread": false} : convo
      )
      store.writeQuery({
        query: props.getConversations,
        variables: { _id: props.userInfo._id },
        data: { getConversations: copy },
      });
    },
  });

  const [sendMessageQuery] = useMutation(SEND_MESSAGE, {
    refetchQueries: [
      {
        query: props.getConversations,
        variables: { _id: props.userInfo._id },
      },
    ],
  });
  const getMessages = useQuery(GET_MESSAGES, {
    variables: { senderID: props.userInfo._id, receiverID: props.currentChat },
  });
  const getUser = useQuery(GET_SINGLE_USER, {
    variables: { _id: props.currentChat },
  });

  const apolloClient = useApolloClient();

  const updateMsgCache = (newMsg) => {
    if(newMsg.senderID != props.userInfo._id &&  newMsg.receiverID != props.userInfo._id){
      return
    }
    const msgStore = apolloClient.readQuery({
      query: GET_MESSAGES,
      variables: {
        senderID: props.userInfo._id,
        receiverID: props.currentChat,
      },
    });

    if (msgStore.getMessages[0].conversationID === props.currentConvo) {
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
    }
  };

  useSubscription(NEW_MESSAGE, {
    onSubscriptionData: ({ subscriptionData }) => {
      updateMsgCache(subscriptionData.data.newMessage);
    },
  });

  const updateConvoCache = async (convo) => {
    if(convo.members.filter(member=>member._id === props.userInfo._id).length === 0){
      return
    }
    if(props.activeElement === "messageInput" && convo._id === props.currentConvo){
      convo.unread=false
      await readMsg({ variables: { _id: convo._id } });
    }
    const convoStore = apolloClient.readQuery({
      query: props.getConversations,
      variables: { _id: props.userInfo._id },
    });
    let copy = [...convoStore.getConversations];
    copy = copy.filter(x => x._id != convo._id);
    copy.unshift(convo)
    apolloClient.writeQuery({
      query: props.getConversations,
      variables: { _id: props.userInfo._id },
      data: { getConversations: copy },
    });
  };

  useSubscription(UPATED_CONVO, {
    onSubscriptionData: ({ subscriptionData }) => {
      updateConvoCache(subscriptionData.data.updatedConvo);
    },
  });

  const sendMessage = async (event) => {
    event.preventDefault();
    if (messageField === "") return;
    let senderID = props.userInfo._id;
    let receiverID = props.currentChat;
    let content = messageField.value;
    await sendMessageQuery({ variables: { senderID, receiverID, content } });
    messageField.clear();
  };

  const readMessage = async (event) => {
    event.preventDefault();

    let currentChat = props.convoHistory.data.getConversations.filter(
      (convo) => convo._id === props.currentConvo
    );
    if (currentChat[0].lastSender === props.userInfo._id) {
      return;
    }
    await readMsg({ variables: { _id: props.currentConvo } });
  };

  const chat = () => {
    if (getMessages.loading || getMessages.data.getMessages === null) {
      return null;
    }
    return (
      <div className="chat-display-chat-parent">
        <ChatMessage
          messageData={getMessages.data.getMessages}
          userInfo={props.userInfo}
        />
        <form onSubmit={sendMessage} className="chat-display-chat-send-message-form">
          <input
            id="messageInput"
            type="text"
            className="chat-display-chat-message-field"
            value={messageField.value}
            onClick={readMessage}
            onChange={messageField.onChange}
            placeholder="Type a message..."
          />
          <input type="image" src="../../../../assets/images/send.png" />
        </form>
      </div>
    );
  };

  const about = () => {
    return (
      <div className="chat-display-about">
        <h1>{getUser.data.getSingleUser.fullName}</h1>
        <img
          src={`data:image/png;base64,${getUser.data.getSingleUser.profilePicture}`}
        />
        <h2>About </h2>
        <div className="chat-display-about-content">
          {getUser.data.getSingleUser.about}
        </div>
      </div>
    );
  };

  const defaultChatDisplay = () => {
    if (props.convoHistory.data.getConversations.length === 0) {
      return (
        <div className="chat-display-default">
          <h1>Hi, welcome to MyChat</h1>
          <p>
            To get started, enter a name from the contact list to the left to
            start messaging!
          </p>
        </div>
      );
    }
  };

  return (
    !getUser.loading &&
    !getMessages.loading && (
      <div>
        {props.currentChat === "" &&
          props.convoHistory.data.getConversations.length === 0 &&
          defaultChatDisplay()}
        <div className="chat-display-parent">
          {props.currentChat != "" && chat()}
          {props.currentChat != "" && about()}
        </div>
      </div>
    )
  );
};

export default ChatDisplay;
