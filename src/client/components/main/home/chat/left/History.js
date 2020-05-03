import React, { Fragment, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import adjustTime from "Utilities/adjustTime";
import "MainStylesheets/chat/chatHistory.css";

const History = (props) => {
  if (props.convoHistory.loading) {
    const arr = [];
    for (let i = 0; i < 11; i++) {
      arr.push(
        <div key={`Hist${i}`} className="chat-history-wrapper">
          <div className="chat-history-info-wrapper">
            <div className="chat-history-img-wrapper">
              <img
                className="chat-history-img"
                src="images/profilePlaceholder.png"
              />
            </div>
            <div className="chat-history-words-wrapper">
              <div className="chat-history-name-header-wrapper">
                <img
                  className="chat-history-name-header-placeholder"
                  src="images/contentPlaceholder.png"
                />
              </div>
              <div className="">
                <img
                  className="chat-history-content-placeholder"
                  src="images/contentPlaceholder.png"
                />
              </div>
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
    if (props.convoHistory.data.getConversations.length === 0) {
      return (
        <div className="no-history-div">
          You don't have any history of conversations please type a name above
          to get started
        </div>
      );
    }

    const changeChat = () => {
      if (props.windowWidth <= 768) {
        props.setMobileDisplay("chat");
      }
    };

    return (
      <div className="chat-history-container">
        {props.convoHistory.data.getConversations.map((convo) => (
          <div
            key={convo._id}
            className={
              convo.unread && convo.lastSender != props.userInfo._id
                ? "pointer-wrapper-bold"
                : "pointer-wrapper"
            }
          >
            <NavLink
              exact
              to={`/home/messages/${
                convo.members[0]._id != props.userInfo._id
                  ? convo.members[0]._id
                  : convo.members[1]._id
              }`}
              className="link-flex"
              activeClassName="linkActive"
            >
              <div
                key={convo._id}
                className={
                  convo._id === props.currentConvo && props.windowWidth > 768
                    ? "chat-history-wrapper-current"
                    : "chat-history-wrapper"
                }
                onClick={() => {
                  changeChat();
                }}
              >
                <div className="chat-history-info-wrapper">
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
                </div>

                <div className="chat-history-timestamp">
                  <span> {adjustTime(convo.lastMessageTime, false)}</span>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    );
  };

  return <Fragment>{displayHistory()}</Fragment>;
};

export default History;
