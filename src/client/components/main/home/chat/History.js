import React from "react";

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

    const changeChat = members => {
      let id =
        members[0]._id != props.userInfo._id ? members[0]._id : members[1]._id;
      props.setCurrentChat(id);
      props.setFromSearch(true);
    };
    return (
      <div className="chat-history-container">
        {props.convoHistory.data.getConversations.map(convo => (
          <div
            className="chat-history-wrapper"
            key={convo._id}
            onClick={() => {
              changeChat(convo.members);
            }}
          >
            {convo.members[0]._id != props.userInfo._id ? (
              <span>
                <img
                  src={`data:image/png;base64,${convo.members[0].profilePicture}`}
                />

                <span className="chat-history-name-header">
                  {convo.members[0].fullName}
                </span>
              </span>
            ) : (
              <span>
                <img
                  src={`data:image/png;base64,${convo.members[1].profilePicture}`}
                />

                <span className="chat-history-name-header">
                  {convo.members[1].fullName}
                </span>
              </span>
            )}
            <span className="chat-history-details">
              {convo.sender[0].fullName === props.userInfo.fullName
                ? "You:"
                : convo.sender[0].fullName}
              {convo.lastMessage}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return <div>{displayHistory()}</div>;
};

export default History;
