import axios, { AxiosError } from "axios";
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
  data: T | T[];
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

interface CreateNewTaskRequestBody {
  task: string;
  dueDate: string | null;
  tagNames: string[] | null;
  listName: string | null;
}

export type NewTaskResponseData = Pick<
  SerializableTaskListModelAttributes,
  "task" | "dueDate" | "tagNames" | "listName"
>;

export async function createNewTask(
  task: string,
  dueDate: string | null,
  tagNames: string[] | null,
  listName: string | null
) {
  const data: CreateNewTaskRequestBody = { task, dueDate, tagNames, listName };

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
  return await axios.get<SuccessResponseBody<TaskListResponseData[]>>(
    `${API_BASE_URL}/tasks/all`
  );
}

export async function getFilteredTaskList() {
  return await axios.get<SuccessResponseBody<TaskListResponseData[]>>(
    `${API_BASE_URL}/filters`
  );
}
