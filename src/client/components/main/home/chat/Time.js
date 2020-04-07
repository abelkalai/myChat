import React from "react";
import adjustTime from "../../../utilities/adjustTime"

const Time = props => {
  return <div>{adjustTime(props.time, false)}</div>;
};

export default Time;
