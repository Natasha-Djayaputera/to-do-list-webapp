export interface TaskListRequestParameter {
  id?: number;
  task?: string;
  isDone?: boolean;
  dueDate?: moment.Moment;
  tagNames?: string[];
  listName?: string;
  startDate?: string;
  endDate?: string;
  sort?: string[];
  page?: number;
  size?: number;
}

export const requestParamaterHandler = (
  param: TaskListRequestParameter
): string => {
  let requestParameter = `?`;
  if (param.task) {
    requestParameter += `task=${param.task}&`;
  }
  if (param.dueDate) {
    requestParameter += `dueDate=${param.dueDate}&`;
  }
  if (param.startDate) {
    requestParameter += `startDate=${param.startDate}&`;
  }
  if (param.endDate) {
    requestParameter += `endDate=${param.endDate}&`;
  }
  if (param.tagNames !== undefined && param.tagNames.length !== 0) {
    for (let i = 0; i < param.tagNames.length; i++) {
      requestParameter += `tagNames=${param.tagNames[i]}&`;
    }
  }
  if (param.listName) {
    requestParameter += `listName=${param.listName}&`;
  }
  if (param.sort !== undefined && param.sort.length !== 0) {
    for (let i = 0; i < param.sort.length; i++) {
      requestParameter += `sort=${param.sort[i]}&`;
    }
  }
  if (param.page) {
    requestParameter += `page=${param.page}&`;
  }
  if (param.size) {
    requestParameter += `size=${param.size}&`;
  }
  return requestParameter;
};
