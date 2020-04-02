import React from "react";
import Moment from "moment";

const Time = props => {
  let result;
  let messageDateObject = new Date(parseInt(props.time)); //Week, year
  let localTime = messageDateObject.toLocaleTimeString();
  let secondColon = localTime.indexOf(":", localTime.indexOf(":") + 1);
  
  result = `${localTime.slice(0, secondColon)}
  ${localTime.slice(8, 11)}`;

  // Different day
  if (Moment(messageDateObject).day() != Moment().day()) {
    result = `${messageDateObject.toDateString().slice(0, 3)}`;
  }
  // Different week
  if (Moment(messageDateObject).week() != Moment().week()) {
    result = `${messageDateObject.toDateString().slice(4, 10)}`;
  }
  // Different Year
  if (Moment(messageDateObject).year() != Moment().year()) {
    result = `${messageDateObject.toLocaleDateString()}`;
  }

  return <div>{result}</div>;
};

export default Time;
