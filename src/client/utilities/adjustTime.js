import Moment from "moment";

const adjustTime = (timeStamp, showTimeOfDay) => {
  let date = new Date(parseInt(timeStamp)); //Week, year
  let localTime = date.toLocaleTimeString();
  let timeToShow;

  timeToShow = `${localTime.slice(0, localTime.indexOf(":")+3)} ${localTime.slice(-2)}`;

  // Different day
  if (Moment(date).day() != Moment().day()) {
    timeToShow = `${date.toDateString().slice(0, 3)}`;
  }
  // Different week
  if (Moment(date).week() != Moment().week()) {
    timeToShow = `${date.toDateString().slice(4, 10)}`;
  }
  // Different Year
  if (Moment(date).year() != Moment().year()) {
    timeToShow = `${date.toLocaleDateString()}`;
  }

  timeToShow =
    showTimeOfDay && !timeToShow.includes(":")
      ? `${timeToShow} at ${localTime.slice(0, localTime.indexOf(":")+3)} ${localTime.slice(-2)}`
      : timeToShow;

  return timeToShow;
};

export default adjustTime;
