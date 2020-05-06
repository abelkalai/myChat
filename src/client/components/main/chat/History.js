import React, { Fragment, useEffect } from "react";
import { NavLink } from "react-router-dom";
import adjustTime from "Utilities/adjustTime";
import "MainStylesheets/chat/chatHistory.css";

const History = (props) => {
  if (props.convoHistory.loading) {
    const arr = [];
    for (let i = 0; i < 11; i++) {
      arr.push(
        <div key={`Hist${i}`}>
          <div className="chat-history-wrapper">
            <img
              className="chat-history-img"
              src="images/profilePlaceholder.png"
            />
            <div className="chat-history-words-wrapper">
              <img
                className="chat-history-name-header-placeholder"
                src="images/contentPlaceholder.png"
              />

              <img
                className="chat-history-content-placeholder"
                src="images/contentPlaceholder.png"
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="chat-history-container">
        {arr.map((element) => element)}
      </div>
    );
  }
  useEffect(() => {
    let unreadMsgs = props.convoHistory.data.getConversations.filter(
      (convo) => convo.unread && convo.lastSender != props.userInfo._id
    ).length;

    document.title =
      unreadMsgs > 0 ? `(${unreadMsgs}) Unread Messages | MyChat` : "MyChat";
  }, [props.convoHistory]);

  const displayHistory = () => {
    return props.convoHistory.data.getConversations.length > 0 ? (
      <div className="chat-history-container">
        {props.convoHistory.data.getConversations.map((convo) => (
          <div
            key={convo._id}
            className={
              convo.unread && convo.lastSender != props.userInfo._id
                ? "chat-history-unread"
                : null
            }
            onClick={() => {
              if (props.windowWidth <= 768) {
                props.setMobileDisplay("messages");
              }
            }}
          >
            <div
              key={convo._id}
              className={
                convo._id === props.currentConvo
                  ? "chat-history-wrapper-current"
                  : "chat-history-wrapper"
              }
            >
              <NavLink
                exact
                to={`/home/messages/${
                  convo.members[0]._id != props.userInfo._id
                    ? convo.members[0]._id
                    : convo.members[1]._id
                }`}
                className="link"
                activeClassName="linkActive"
              >
                <img
                  alt={
                    convo.members[0]._id != props.userInfo._id
                      ? convo.members[0].fullName
                      : convo.members[1].fullName
                  }
                  className="chat-history-img"
                  src={`data:image/png;base64,${
                    convo.members[0]._id != props.userInfo._id
                      ? convo.members[0].profilePicture
                      : convo.members[1].profilePicture
                  }`}
                />

                <div className="chat-history-words-wrapper">
                  <div className="chat-history-overflow-name-header">
                    {convo.members[0]._id != props.userInfo._id
                      ? convo.members[0].fullName
                      : convo.members[1].fullName}
                  </div>

                  <div className="chat-history-overflow-message">
                    {convo.lastSender === props.userInfo._id ? "You: " : null}

                    {convo.lastMessage}
                  </div>
                </div>

                <div className="chat-history-timestamp">
                  <span> {adjustTime(convo.lastMessageTime, false)}</span>
                </div>
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    ) : null;
  };

  return <Fragment>{displayHistory()}</Fragment>;
};

export default History;
