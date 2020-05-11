import React, { Fragment, useEffect } from "react";
import { NavLink } from "react-router-dom";
import adjustTime from "Utilities/adjustTime";
import "HomePageStylesheets/chat/history.css";

const History = (props) => {
  if (props.getConvosQuery.loading) {
    const arr = [];
    for (let i = 0; i < 11; i++) {
      arr.push(
        <div key={`Hist${i}`}>
          <div className="conversation">
            <img
              className="history-user-img"
              src="images/profilePlaceholder.png"
            />
            <div className="history-text-container">
              <img
                className="history-contact-name-placeholder"
                src="images/contentPlaceholder.png"
              />

              <img
                className="history-message-placeholder"
                src="images/contentPlaceholder.png"
              />
            </div>
          </div>
        </div>
      );
    }
    return <div id="history-container">{arr.map((element) => element)}</div>;
  }
  useEffect(() => {
    let unreadMsgs = props.getConvosQuery.data.getConversations.filter(
      (convo) => convo.unread && convo.lastSender != props.userInfo._id
    ).length;

    document.title =
      unreadMsgs > 0 ? `(${unreadMsgs}) Unread Messages | MyChat` : "MyChat";
  }, [props.getConvosQuery]);

  return props.getConvosQuery.data.getConversations.length > 0 ? (
    <div id="history-container">
      {props.getConvosQuery.data.getConversations.map((convo) => (
        <div
          key={convo._id}
          className={
            convo.unread && convo.lastSender != props.userInfo._id
              ? "bold-text"
              : null
          }
          onClick={() => {
            if (props.windowWidth <= 768) {
              props.setMobileDisplay("chatWindow");
            }
          }}
        >
          <div
            key={convo._id}
            className={
              convo._id === props.currentConvo && props.windowWidth > 768
                ? "current-conversation"
                : "conversation"
            }
          >
            <NavLink
              exact
              to={`/home/messages/${
                convo.members[0]._id != props.userInfo._id
                  ? convo.members[0]._id
                  : convo.members[1]._id
              }`}
              className="nav-link"
              activeClassName="active-nav-link"
            >
              <img
                alt={
                  convo.members[0]._id != props.userInfo._id
                    ? convo.members[0].fullName
                    : convo.members[1].fullName
                }
                className="history-user-img"
                src={`data:image/png;base64,${
                  convo.members[0]._id != props.userInfo._id
                    ? convo.members[0].profilePicture
                    : convo.members[1].profilePicture
                }`}
              />

              <div className="history-text-container">
                <div className="history-contact-name">
                  {convo.members[0]._id != props.userInfo._id
                    ? convo.members[0].fullName
                    : convo.members[1].fullName}
                </div>

                <div className="history-message">
                  {convo.lastSender === props.userInfo._id ? "You: " : null}

                  {convo.lastMessage}
                </div>
              </div>

              <div className="history-timestamp">
                <span> {adjustTime(convo.lastMessageTime, false)}</span>
              </div>
            </NavLink>
          </div>
        </div>
      ))}
    </div>
  ) : null;
};

export default History;
