export const relativeDueDateHandler = (inputDate: Date) => {
  const currentDate = new Date();
  let relativeDueDate = "";
  let isDue = false;

  if (inputDate.setHours(0, 0, 0, 0) - currentDate.setHours(0, 0, 0, 0) < 0) {
    isDue = true;
  }

  if (currentDate.toDateString() === inputDate.toDateString()) {
    relativeDueDate = "Today";
  } else if (
    inputDate.setHours(0, 0, 0, 0) - currentDate.setHours(0, 0, 0, 0) <=
      86_400_000 &&
    inputDate.setHours(0, 0, 0, 0) - currentDate.setHours(0, 0, 0, 0) > 0
  ) {
    relativeDueDate = "Tomorrow";
  } else if (
    currentDate.getFullYear() === inputDate.getFullYear() &&
    currentDate.getMonth() === inputDate.getMonth() &&
    inputDate.getDate() - currentDate.getDate() <= 6 &&
    inputDate.getDate() - currentDate.getDate() >= 0
  ) {
    switch (inputDate.getDay()) {
      case 0:
        relativeDueDate = "Sunday";
        break;
      case 1:
        relativeDueDate = "Monday";
        break;
      case 2:
        relativeDueDate = "Tuesday";
        break;
      case 3:
        relativeDueDate = "Wednesday";
        break;
      case 4:
        relativeDueDate = "Thursday";
        break;
      case 5:
        relativeDueDate = "Friday";
        break;
      case 6:
        relativeDueDate = "Saturday";
        break;
    }
  } else {
    relativeDueDate = `${inputDate.getDate()}`;
    switch (inputDate.getMonth()) {
      case 0:
        relativeDueDate += " Jan";
        break;
      case 1:
        relativeDueDate += " Feb";
        break;
      case 2:
        relativeDueDate += " Mar";
        break;
      case 3:
        relativeDueDate += " Apr";
        break;
      case 4:
        relativeDueDate += " May";
        break;
      case 5:
        relativeDueDate += " Jun";
        break;
      case 6:
        relativeDueDate += " Jul";
        break;
      case 7:
        relativeDueDate += " Aug";
        break;
      case 8:
        relativeDueDate += " Sep";
        break;
      case 9:
        relativeDueDate += " Oct";
        break;
      case 10:
        relativeDueDate += " Nov";
        break;
      case 11:
        relativeDueDate += " Dec";
        break;
    }
    if (currentDate.getFullYear() !== inputDate.getFullYear()) {
      relativeDueDate += ` ${inputDate.getFullYear()}`;
    }
  }
  return { date: relativeDueDate, isDue: isDue };
};
