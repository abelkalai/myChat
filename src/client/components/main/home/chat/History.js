import React, { Fragment } from "react";

const History = props => {
  if (props.convoHistory.data === null) {
    return null;
  }

  const displayHistory = () => {
    if (props.convoHistory.data.getConversations.length === 0) {
      return (
        <div>
          You don't have any history of convos please type a name above to get
          started
        </div>
      );
    }

    const changeChat = (convo,i) => {
      let id =
        convo.members[0]._id != props.userInfo._id
          ? convo.members[0]._id
          : convo.members[1]._id;
      props.setCurrentChat(id);
      props.setCurrentConvo(i);
    };

    return (
      <div className="chat-history-container">
        {props.convoHistory.data.getConversations.map((convo, i) => (
          <div
            key={convo._id}
            className={
              i === props.currentConvo
                ? "chat-history-wrapper-current"
                : "chat-history-wrapper"
            }
            onClick={() => {
              changeChat(convo,i);
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
              {convo.sender[0].fullName === props.userInfo.fullName
                ? "You:"
                : null}
              {convo.lastMessage}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return <div>{displayHistory()}</div>;
};

export default History;
