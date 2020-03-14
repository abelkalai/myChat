import React from "react";

const Confirmation = props => {
  return (
    <div className="center">
      <h1> {props.confirmMsg}</h1>
    </div>
  );
};

export default Confirmation;
