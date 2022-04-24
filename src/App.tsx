import React, { useState } from "react";
import "./App.css";
import { relativeDueDateHandler } from "./handlers/relative-due-date";
import moment from "moment";
import {
  createNewTask,
  FailResponseBody,
  getTasklist,
  isAxiosError,
  NewTaskResponseData,
  SuccessResponseBody,
} from "./services/api";

const INIT_TASKLIST = {
  id: 0,
  task: ``,
  isDone: false,
  dueDate: moment(),
  tagNames: [],
  listName: ``,
};

const INIT_NEW_TASK = "";

const INIT_DUE_DATE = moment();

const INIT_RELATIVE_DUE_DATE = {
  date: "Today",
  isDue: false,
};

export interface Tasklist {
  id: number;
  task: string;
  isDone: boolean;
  dueDate: moment.Moment;
  tagNames: string[];
  listName: string;
}

const App: React.VFC = () => {
  const [idCount, setIdCount] = useState(0);
  const [taskList, setTaskList] = useState<Tasklist[]>([]);
  const [newTask, setNewTask] = useState(INIT_NEW_TASK);
  const [dueDate, setDueDate] = useState(INIT_DUE_DATE);
  const [relativeDueDate, setRelativeDueDate] = useState<{
    date: string;
    isDue: boolean;
  }>({ ...INIT_RELATIVE_DUE_DATE });
  const [isFocus, setIsFocus] = useState(false);
  const [apiError, setApiError] = useState<Error>();
  const [apiResponse, setApiResponse] =
    useState<SuccessResponseBody<NewTaskResponseData>>();

  const checkedInputHandle = (taskListID: number) => {
    taskList[taskListID - 1].isDone = !taskList[taskListID - 1].isDone;
    setTaskList([...taskList]);
  };

  // const addTask = () => {
  //   if (newTask === "") {
  //     return;
  //   }
  //   setIdCount(idCount + 1);
  //   const newTaskList: Tasklist = { ...INIT_TASKLIST };
  //   newTaskList.task = newTask;
  //   newTaskList.id = idCount;
  //   newTaskList.dueDate = dueDate;
  //   setTaskList(taskList.concat(newTaskList));
  // };
  const addTask = async () => {
    if (newTask === "") {
      return;
    }
    setIdCount(idCount + 1);
    const newTaskList: Tasklist = { ...INIT_TASKLIST };
    newTaskList.task = newTask;
    newTaskList.id = idCount;
    newTaskList.dueDate = dueDate;
    setTaskList(taskList.concat(newTaskList));
    try {
      const response = await createNewTask(
        newTask,
        moment(dueDate).format("YYYY MM D"),
        null,
        null
      );

      setApiResponse(response.data);
      setApiError(undefined);
      console.log(response.data);
    } catch (e) {
      setApiResponse(undefined);
      if (isAxiosError<FailResponseBody>(e)) {
        const errorMessage = e.response?.data.error.message;

        if (errorMessage === "invalid-new-task") {
          setApiError(new Error(`No task added`));
          return;
        }
      }
      setApiError(new Error("Unhandled exception, please try again later"));
    }
  };

  const isEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
      e.currentTarget.value = "";
      setNewTask(INIT_NEW_TASK);
      setRelativeDueDate({ ...INIT_RELATIVE_DUE_DATE });
      setDueDate(INIT_DUE_DATE);
    }
  };

  const populateTaskList = async () => {
    try {
      const response = await getTasklist();
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const mapTask = taskList
    .slice(0, taskList.length)
    .filter((task) => !task.isDone)
    .map((task) => {
      let currentTaskList = task;
      let currentDueDate = relativeDueDateHandler(currentTaskList.dueDate);
      return (
        <button id={`${currentTaskList.id}`} key={`${currentTaskList.id}`}>
          <input
            id={`${currentTaskList.id}`}
            type="checkbox"
            onChange={() => {
              checkedInputHandle(currentTaskList.id);
            }}
          ></input>
          <p>{currentTaskList.task}</p>
          <label className={`${currentDueDate.isDue ? "color-red" : ""}`}>
            {currentDueDate.date}
          </label>
        </button>
      );
    });

  populateTaskList();

  return (
    <div className="App">
      <div className="Header"></div>
      <div className="Board">
        <div className="Section">
          <div className="Section-Wrapper">
            <button>Today</button>
            <button>Next 7 Days</button>
            <button>Inbox</button>
            <p>Lists</p>
            <p>Tags</p>
            <p>Filters</p>
            <button>Completed</button>
          </div>
        </div>
        <div className="Task">
          <h2>Today</h2>
          <div className="Task-Wrapper">
            <div
              className="Task-Input"
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => {
                setIsFocus(false);
              }}
            >
              <input
                id="taskinput"
                type="text"
                placeholder='+ Add task to "Today", press Enter to save.'
                autoComplete="off"
                onKeyDown={(e) => {
                  isEnter(e);
                }}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setNewTask(e.currentTarget.value);
                }}
              ></input>
              {(isFocus || newTask) && (
                <div className="Task-Date-Input">
                  <label
                    className={`${relativeDueDate.isDue ? "color-red" : ""}`}
                  >
                    {relativeDueDate.date}
                  </label>
                  <input
                    type="date"
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      let inputDate = moment(e.currentTarget.value);
                      setDueDate(inputDate);
                      let relativeDate = relativeDueDateHandler(inputDate);
                      setRelativeDueDate({
                        date: relativeDate.date,
                        isDue: relativeDate.isDue,
                      });
                    }}
                  ></input>
                </div>
              )}
            </div>
            {apiResponse !== undefined && <label>{apiResponse.data}</label>}
            {apiError instanceof Error && <label>{apiError.message}</label>}
            {mapTask}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
