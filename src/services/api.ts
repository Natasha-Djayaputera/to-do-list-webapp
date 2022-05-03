import axios, { AxiosError } from "axios";
import moment from "moment";
import { Tasklist } from "../App";
import {
  requestParamaterHandler,
  TaskListRequestParameter,
} from "../handlers/request-parameter";
import { taskListDataHandler } from "../handlers/tasklist-data";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export function isAxiosError<T>(
  candidate: unknown
): candidate is AxiosError<T> {
  return (
    typeof candidate === "object" &&
    candidate !== null &&
    "isAxiosError" in candidate &&
    (candidate as AxiosError).isAxiosError === true
  );
}

export interface SuccessResponseBody<T> {
  code: "success";
  data: T;
}

export interface FailResponseBody {
  code: "fail";
  error: { message: string };
}

export interface SerializableTaskListModelAttributes {
  id: number;
  task: string;
  isDone: boolean;
  dueDate: string | null;
  tagNames: string[] | null;
  listName: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type CreateNewTaskRequestBody = Pick<
  SerializableTaskListModelAttributes,
  "task" | "isDone" | "dueDate" | "tagNames" | "listName"
>;

export type NewTaskResponseData = CreateNewTaskRequestBody;

export async function createNewTask(currentTask: Tasklist) {
  const data: CreateNewTaskRequestBody = {
    ...currentTask,
    task: currentTask.task,
    dueDate:
      currentTask.dueDate === undefined
        ? null
        : moment(currentTask.dueDate).format("YYYY-MM-DD"),
    tagNames: currentTask.tagNames.length === 0 ? null : currentTask.tagNames,
    listName: currentTask.listName === "" ? null : currentTask.listName,
  };
  console.log("currentTask " + currentTask.listName);
  console.log("data " + data.listName);
  return await axios.post<SuccessResponseBody<NewTaskResponseData>>(
    `${API_BASE_URL}/tasks`,
    data
  );
}

export type TaskListResponseData = Omit<
  SerializableTaskListModelAttributes,
  "createdAt" | "updatedAt" | "deletedAt"
>;

export async function getTasklist() {
  const response = await axios.get<SuccessResponseBody<TaskListResponseData[]>>(
    `${API_BASE_URL}/tasks/all`
  );
  return taskListDataHandler(response.data.data);
}

export async function getFilteredTasklist(param: TaskListRequestParameter) {
  let requestParameter = requestParamaterHandler(param);
  const response = await axios.get<SuccessResponseBody<TaskListResponseData[]>>(
    `${API_BASE_URL}/tasks/filters${requestParameter}`
  );
  return taskListDataHandler(response.data.data);
}

export async function searchTasklist(task: string) {
  const response = await axios.get<SuccessResponseBody<TaskListResponseData[]>>(
    `${API_BASE_URL}/tasks/${task}`
  );
  return taskListDataHandler(response.data.data);
}

export type ModifyTaskListRequestBody = TaskListResponseData;

export async function modifyTask(currentTask: Tasklist) {
  const data: ModifyTaskListRequestBody = {
    ...currentTask,
    dueDate: moment(currentTask.dueDate).format("YYYY-MM-DD"),
  };

  await axios.patch<SuccessResponseBody<[number, Tasklist[]]>>(
    `${API_BASE_URL}/tasks/${data.id}`,
    data
  );
  console.log("Task updated");
  return;
}

export async function deleteTask(id: number) {
  const response = await axios.delete<SuccessResponseBody<{ message: string }>>(
    `${API_BASE_URL}/tasks/${id}`
  );
  console.log(response.data.data.message);
  return;
}

export interface List {
  list: string[] | null;
}

export async function getAllList() {
  const response = await axios.get<SuccessResponseBody<List>>(
    `${API_BASE_URL}/listName`
  );
  const list: List = response.data.data;
  return list.list;
}

export async function renameList(currentList: string, modifiedList: string) {
  await axios.patch<SuccessResponseBody<[number, Tasklist[]]>>(
    `${API_BASE_URL}/listName/${currentList}`,
    modifiedList
  );
  console.log("List renamed");
  return;
}

export async function deleteList(currentList: string) {
  const response = await axios.delete<SuccessResponseBody<{ message: string }>>(
    `${API_BASE_URL}/listName/${currentList}`
  );
  console.log(response.data.data.message);
  return;
}
export interface Tags {
  tags: string[] | null;
}

export async function getAllTags() {
  const response = await axios.get<SuccessResponseBody<Tags>>(
    `${API_BASE_URL}/tagNames`
  );
  const tags: Tags = response.data.data;
  return tags.tags;
}

export async function deleteTag(currentTag: string) {
  await axios.delete<SuccessResponseBody<{ message: string }>>(
    `${API_BASE_URL}/tagNames/${currentTag}`
  );
}
