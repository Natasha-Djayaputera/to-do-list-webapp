import moment from "moment";
import React, { useState } from "react";
import "./App.css";
import { ReactComponent as ListLogo } from "./assets/list.svg";
import { ReactComponent as TagsLogo } from "./assets/tags.svg";
import { relativeDueDateHandler } from "./handlers/relative-due-date";
import {
  createNewTask,
  FailResponseBody,
  getAllList,
  getAllTags,
  getTasklist,
  isAxiosError,
  modifyTask,
} from "./services/api";

const INIT_TASKLIST = {
  id: -1,
  task: ``,
  isDone: false,
  dueDate: undefined,
  tagNames: [],
  listName: ``,
};

const INIT_NEW_TASK = "";

const INIT_DUE_DATE = undefined;

const INIT_RELATIVE_DUE_DATE = {
  date: undefined,
  isDue: false,
};

const TAGS_REGEX = /#\w+/g;

const LIST_REGEX = /@\w+/g;

export interface Tasklist {
  id: number;
  task: string;
  isDone: boolean;
  dueDate?: moment.Moment;
  tagNames: string[];
  listName: string;
}

export type PageIdentifier = "Page" | "Tags" | "List";
export type Page = [PageIdentifier, string];

const App: React.VFC = () => {
  const [page, setPage] = useState<Page>(["Page", "Today"]);
  const [taskList, setTaskList] = useState<Tasklist[]>([]);
  const [tags, setTags] = useState<string[] | null>(null);
  const [list, setList] = useState<string[] | null>(null);
  const [newTask, setNewTask] = useState(INIT_NEW_TASK);
  const [dueDate, setDueDate] = useState<moment.Moment | undefined>(undefined);
  const [relativeDueDate, setRelativeDueDate] = useState<{
    date?: string;
    isDue: boolean;
  }>({ ...INIT_RELATIVE_DUE_DATE });
  const [isPopulated, setIsPopulated] = useState(false);
  const [isDueDateUpdated, setIsDueDateUpdated] = useState(false);

  const addTask = async () => {
    if (newTask === "") return;
    let currentTask: Tasklist = { ...INIT_TASKLIST };
    if (newTask !== undefined) {
      if (newTask.includes("#")) {
        const tags = newTask.match(TAGS_REGEX);
        if (tags !== null) {
          currentTask.tagNames = tags.map((tag) => {
            return tag.substring(1);
          });
        }
      }
      if (newTask.includes("@")) {
        const list = newTask.match(LIST_REGEX);
        if (list !== null) {
          currentTask.listName = list.slice(0, 1).toString().substring(1);
        }
      }
      currentTask.task = newTask
        .replace(TAGS_REGEX, "")
        .replace(LIST_REGEX, "")
        .trim();
    }
    currentTask.dueDate = dueDate;

    if (page[0] === "Tags") currentTask.tagNames.push(page[1]);

    try {
      const response = await createNewTask(currentTask);
      setIsPopulated(false);
      console.log(response.data);
    } catch (e) {
      if (isAxiosError<FailResponseBody>(e)) {
        const errorCode = e.response?.status;
        if (errorCode === 400) {
          console.log("No Task Added");
          return;
        }
      }
      console.log("Unhandled exception, please try again later");
    }
  };

  const checkedInputHandle = (currentTaskList: Tasklist) => {
    const modifiedTaskList = {
      ...currentTaskList,
      isDone: !currentTaskList.isDone,
    };
    modifyTask(modifiedTaskList);
    setIsPopulated(false);
  };

  const isEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
      e.currentTarget.value = "";
      setNewTask(INIT_NEW_TASK);
      setRelativeDueDate({ ...INIT_RELATIVE_DUE_DATE });
      setDueDate(INIT_DUE_DATE);
      setIsDueDateUpdated(false);
    }
  };

  const populateTaskList = async () => {
    try {
      const response = await getTasklist();
      // console.log(response);
      setTaskList(response);
    } catch (e) {
      console.log(e);
    }
  };

  const populateTags = async () => {
    try {
      const tags = await getAllTags();
      // console.log(tags);
      setTags(tags);
    } catch (e) {
      console.log(e);
    }
  };
  const populateList = async () => {
    try {
      const list = await getAllList();
      // console.log(list);
      setList(list);
    } catch (e) {
      console.log(e);
    }
  };

  const mapTask = taskList
    .slice(0, taskList.length)
    .filter((task) => {
      if (page[0] === "Page") {
        if (page[1] === "Today") {
          return (
            !task.isDone &&
            task.dueDate !== undefined &&
            task.dueDate <= moment() &&
            task.listName === ""
          );
        } else if (page[1] === "Next 7 Days") {
          return (
            !task.isDone &&
            task.dueDate !== undefined &&
            task.dueDate <= moment().add(7, "d") &&
            task.listName === ""
          );
        } else if (page[1] === "Inbox") {
          return !task.isDone && task.listName === "";
        } else if (page[1] === "Completed") {
          return task.isDone;
        }
      }
      if (page[0] === "List" && list !== null && list.includes(page[1])) {
        return !task.isDone && task.listName.includes(page[1]);
      }
      if (page[0] === "Tags" && tags !== null && tags.includes(page[1])) {
        return !task.isDone && task.tagNames.includes(page[1]);
      }
      return !task.isDone && task.listName === "";
    })
    .map((task) => {
      let currentTaskList = task;
      let currentDueDate =
        currentTaskList.dueDate === undefined
          ? undefined
          : relativeDueDateHandler(currentTaskList.dueDate);
      let tags;
      if (currentTaskList.tagNames.length > 0) {
        tags = currentTaskList.tagNames.map((tag) => {
          return (
            <button id={tag} key={tag}>
              {tag}
            </button>
          );
        });
      }
      return (
        <button id={`${currentTaskList.id}`} key={`${currentTaskList.id}`}>
          <input
            id={`${currentTaskList.id}`}
            type="checkbox"
            checked={currentTaskList.isDone}
            onChange={() => {
              checkedInputHandle(currentTaskList);
            }}
          ></input>
          <p>{currentTaskList.task}</p>
          <div className="Tags">{tags}</div>

          {currentDueDate !== undefined && (
            <label className={`${currentDueDate.isDue ? "color-red" : ""}`}>
              {currentDueDate.date}
            </label>
          )}
        </button>
      );
    });

  const mapTags = tags?.map((tag) => {
    return (
      <button
        id={tag}
        key={tag}
        onClick={() => {
          setPage(["Tags", tag]);
          setIsDueDateUpdated(false);
        }}
      >
        <TagsLogo className="custom-icon" />
        {tag}
      </button>
    );
  });

  const mapList = list?.map((list) => {
    return (
      <button
        id={list}
        key={list}
        onClick={() => {
          setPage(["List", list]);
          setIsDueDateUpdated(false);
        }}
      >
        <ListLogo className="custom-icon" />
        {list}
      </button>
    );
  });

  if (isPopulated === false) {
    populateTaskList();
    populateTags();
    populateList();
    setIsPopulated(true);
  }

  if (isDueDateUpdated === false) {
    if (page[1] === "Today" || page[1] === "Next 7 Days") {
      setDueDate(moment());
      setRelativeDueDate({ ...relativeDueDate, date: "Today" });
      setIsDueDateUpdated(true);
    } else if (page[1] === "Inbox") {
      setDueDate(undefined);
      setRelativeDueDate({ ...relativeDueDate, date: undefined });
      setIsDueDateUpdated(true);
    }
  }

  return (
    <div className="App">
      <div className="Header"></div>
      <div className="Board">
        <div className="Section">
          <div className="Section-Wrapper">
            <button
              id={"Today"}
              onClick={() => {
                setPage(["Page", "Today"]);
                setIsDueDateUpdated(false);
              }}
            >
              Today
            </button>
            <button
              id={"Next 7 Days"}
              onClick={() => {
                setPage(["Page", "Next 7 Days"]);
                setIsDueDateUpdated(false);
              }}
            >
              Next 7 Days
            </button>
            <button
              id={"Inbox"}
              onClick={() => {
                setPage(["Page", "Indox"]);
                setIsDueDateUpdated(false);
              }}
            >
              Inbox
            </button>
            <p>Lists</p>
            <div className="Nested">{mapList}</div>
            <p>Tags</p>
            <div className="Nested">{mapTags}</div>
            <p>Filters</p>
            <button
              id={"Completed"}
              onClick={() => {
                setPage(["Page", "Completed"]);
                setIsDueDateUpdated(false);
              }}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="Task">
          <h2>{page[1]}</h2>
          {page[1] !== "Completed" && (
            <div className="Task-Input">
              <input
                id="taskinput"
                type="text"
                placeholder={`+ Add task to "${page[1]}", press Enter to save. Use "#" for tag and "@" for list.`}
                autoComplete="off"
                onKeyDown={(e) => {
                  isEnter(e);
                }}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setNewTask(e.currentTarget.value);
                }}
              ></input>
              {newTask && (
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
          )}
          <div
            className={`Task-Wrapper ${
              page[1] === "Completed" ? "Completed" : ""
            }`}
          >
            {mapTask}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
