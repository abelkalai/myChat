import React, { Fragment } from "react";
import adjustTime from "../../../../../utils/adjustTime"
import "../../../../../assets/stylesheets/components/main/chatHistory.css";

const History = (props) => {
  const arr = [];
  for (let i = 0; i < 11; i++) {
    arr.push(
      <div key={`Hist${i}`}>
        <div className="chat-history-wrapper">
          <div className="chat-history-img-container">
            <img
              className="chat-history-wrapper-img"
              src="../../../../assets/images/profilePlaceholder.png"
            />
          </div>
          <div className="chat-history-name-header">
            <img
              className="chat-history-name-header-placeholder"
              src="../../../../assets/images/contentPlaceholder.png"
            />
          </div>
          <div className="chat-history-content">
            <img
              className="chat-history-content-placeholder"
              src="../../../../assets/images/contentPlaceholder.png"
            />
          </div>
        </div>
      </div>
    );
  }
  if (props.convoHistory.loading) {
    return (
      <div className="chat-history-container">
        {arr.map((element) => element)}
      </div>
    );
  }

  let unreadMsgs = props.convoHistory.data.getConversations.filter(
    (convo) => convo.unread  && convo.lastSender != props.userInfo._id
  ).length;

  document.title =
    unreadMsgs > 0 ? `(${unreadMsgs}) Unread Messages | MyChat` : "MyChat";

  const displayHistory = () => {
    if (props.convoHistory.data.getConversations.length === 0) {
      return (
        <div className="no-history-div">
          You don't have any history of conversations please type a name above to get
          started
        </div>
      );
    }

    const changeChat = (members, convoID) => {
      let id =
        members[0]._id != props.userInfo._id ? members[0]._id : members[1]._id;
      props.setCurrentChat(id);
      props.setCurrentConvo(convoID);
    };

    return (
      <div className="chat-history-container">
        {props.convoHistory.data.getConversations.map((convo) => (
          <div
            key={convo._id}
            className={
              convo.unread && convo.lastSender != props.userInfo._id
                ? "chat-history-unread"
                : null
            }
          >
            <div
              key={convo._id}
              className={
                convo._id === props.currentConvo
                  ? "chat-history-wrapper-current"
                  : "chat-history-wrapper"
              }
              onClick={() => {
                changeChat(convo.members, convo._id);
              }}
            >
              <div className="chat-history-img-container">
                <img
                  className="chat-history-wrapper-img"
                  src={`data:image/png;base64,${
                    convo.members[0]._id != props.userInfo._id
                      ? convo.members[0].profilePicture
                      : convo.members[1].profilePicture
                  }`}
                />
              </div>
              <div className="chat-history-name-header">
                {convo.members[0]._id != props.userInfo._id
                  ? convo.members[0].fullName
                  : convo.members[1].fullName}
              </div>

              <div className="chat-history-content">
                {convo.lastSender === props.userInfo._id ? "You: " : null}
                {convo.lastMessage.length > 22
                  ? `${convo.lastMessage.slice(0, 16)}...`
                  : convo.lastMessage}
                <span className="chat-history-time">
                  <div>{adjustTime(convo.lastMessageTime, false)}</div>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return <Fragment>{displayHistory()}</Fragment>;
};

export default History;
