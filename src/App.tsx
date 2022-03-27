import React, { useState } from "react";
import "./App.css";
import { relativeDueDateHandler } from "./handlers/relative-due-date";

const INIT_TASKLIST = {
  id: 0,
  task: ``,
  isDone: false,
  dueDate: new Date(),
  tagNames: [],
  listName: ``,
};

const INIT_NEW_TASK = "";

const INIT_DUE_DATE = new Date();

const INIT_RELATIVE_DUE_DATE = {
  date: "Today",
  isDue: false,
};

export interface Tasklist {
  id: number;
  task: string;
  isDone: boolean;
  dueDate: Date;
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

  const checkedInputHandle = (taskListID: number) => {
    taskList[taskListID - 1].isDone = !taskList[taskListID - 1].isDone;
    setTaskList([...taskList]);
  };

  const addTask = () => {
    if (newTask === "") {
      return;
    }
    setIdCount(idCount + 1);
    const newTaskList: Tasklist = { ...INIT_TASKLIST };
    newTaskList.task = newTask;
    newTaskList.id = idCount + 1;
    newTaskList.dueDate = dueDate;
    setTaskList(taskList.concat(newTaskList));
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

  console.log(taskList);
  console.log(idCount);

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
                      let inputDate = new Date(
                        Date.parse(e.currentTarget.value)
                      );
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
            {mapTask}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
