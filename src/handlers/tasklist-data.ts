import moment from "moment";
import { Tasklist } from "../App";
import { TaskListResponseData } from "../services/api";

export const taskListDataHandler = (
  data: TaskListResponseData[]
): Tasklist[] => {
  const responseData = data;
  const taskList: Tasklist[] = responseData.map((task) => {
    let newTask = {
      id: task.id,
      task: task.task,
      isDone: task.isDone,
      dueDate: task.dueDate === null ? undefined : moment(task.dueDate),
      tagNames: task.tagNames === null ? [] : task.tagNames,
      listName: task.listName === null ? "" : task.listName,
    };
    return newTask;
  });
  return taskList;
};
