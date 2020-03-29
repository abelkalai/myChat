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
    return (
      <div>
        {props.convoHistory.data.getConversations.map(convo => (
          <div key={convo._id}>{convo.lastMessage}</div>
        ))}
      </div>
    );
  };

  return <div>{displayHistory()}</div>;
};

export default History;
