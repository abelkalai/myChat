import React from "React";
import moment from "moment";

const Time = props => {
  let result;
  let messageDateObject = new Date(parseInt(props.time)); //Week, year

  result = `${messageDateObject.toLocaleTimeString().slice(0, 4)}
  ${messageDateObject.toLocaleTimeString().slice(8, 11)}`;

  // Different day
  if (moment(messageDateObject).day() != moment().day()) {
    result = `${messageDateObject.toDateString().slice(0, 3)}`;
  }
  // Different week
  if (moment(messageDateObject).week() != moment().week()) {
    result = `${messageDateObject.toDateString().slice(4, 10)}`;
  }
  // Different Year
  if (moment(messageDateObject).year() != moment().year()) {
    result = `${messageDateObject.toLocaleDateString()}`;
  }

  return <div>{result}</div>;
};

export default Time;
