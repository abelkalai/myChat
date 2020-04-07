import React, { Fragment } from "react";
import { useActiveElement } from "../../../hooks/customHooks";
import Time from "./Time";

const History = (props) => {
  if (props.convoHistory.data === null) {
    return null;
  }

  let unreadMsgs = props.convoHistory.data.getConversations.filter(
    (convo) =>
      convo.unread === true &&
      convo.lastSender != props.userInfo._id &&
      (convo._id != props.currentConvo
        ? true
        : props.activeElement != "messageInput")
  ).length;

  document.title =
    unreadMsgs > 0 ? `(${unreadMsgs}) Unread Messages | MyChat` : "MyChat";

  const displayHistory = () => {
    if (props.convoHistory.data.getConversations.length === 0) {
      return (
        <div>
          You don't have any history of convos please type a name above to get
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
          <span
            key={convo._id}
            className={
              convo.unread &&
              convo.lastSender != props.userInfo._id &&
              (convo._id != props.currentConvo
                ? true
                : document.activeElement.id != "messageInput")
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
              {convo.members[0]._id != props.userInfo._id ? (
                <Fragment>
                  <div className="chat-history-img-container">
                    <img
                      src={`data:image/png;base64,${convo.members[0].profilePicture}`}
                    />
                  </div>
                  <div className="chat-history-name-header">
                    {convo.members[0].fullName}
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className="chat-history-img-container">
                    <img
                      src={`data:image/png;base64,${convo.members[1].profilePicture}`}
                    />
                  </div>
                  <div className="chat-history-name-header">
                    {convo.members[1].fullName}
                  </div>
                </Fragment>
              )}
              <div className="chat-history-content">
                {convo.lastSender === props.userInfo._id ? "You: " : null}
                {convo.lastMessage.length > 22
                  ? `${convo.lastMessage.slice(0, 16)}...`
                  : convo.lastMessage}
                <span className="chat-history-time">
                  <Time time={convo.lastMessageTime} />
                </span>
              </div>
            </div>
          </span>
        ))}
      </div>
    );
  };

  return <div>{displayHistory()}</div>;
};

export default History;
