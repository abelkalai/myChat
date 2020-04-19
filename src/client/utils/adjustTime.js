import Moment from "moment";

const adjustTime = (time, showTimeOfDay) => {
  let result;
  let messageDateObject = new Date(parseInt(time)); //Week, year
  let localTime = messageDateObject.toLocaleTimeString();
  
  result = `${localTime.slice(0, localTime.indexOf(":")+3)} ${localTime.slice(-2)}`;

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

  result =
    showTimeOfDay && !result.includes(":")
      ? `${result} at ${localTime.slice(0, localTime.indexOf(":")+3)} ${localTime.slice(-2)}`
      : result;

  return result;
};

export default adjustTime;
