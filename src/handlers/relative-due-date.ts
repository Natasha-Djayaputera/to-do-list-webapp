import moment from "moment";

export const relativeDueDateHandler = (inputDate: moment.Moment) => {
  const currentDate = moment();
  let relativeDueDate = "";
  let isDue = false;

  if (moment(inputDate).isBefore(currentDate, "day")) {
    isDue = true;
  }

  if (moment(inputDate).isSame(currentDate, "day")) {
    relativeDueDate = "Today";
  } else if (moment(inputDate).isSame(moment(currentDate).add(1, "d"), "day")) {
    relativeDueDate = "Tomorrow";
  } else if (
    moment(inputDate).isBetween(
      moment(currentDate).add(1, "d"),
      moment(currentDate).add(7, "d"),
      "day"
    )
  ) {
    relativeDueDate = `${moment(inputDate).format("dddd")}`;
  } else {
    relativeDueDate = `${moment(inputDate).format("D MMM")}`;
    if (!moment(inputDate).isSame(currentDate, "year")) {
      relativeDueDate += ` ${moment(inputDate).format("YYYY")}`;
    }
  }
  return { date: relativeDueDate, isDue: isDue };
};
