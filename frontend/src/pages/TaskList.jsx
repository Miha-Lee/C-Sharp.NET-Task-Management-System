import React, { useState, useEffect, useContext, useMemo } from "react";
import { Segmented, Row, Button, Modal, Spin } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import Task from "../components/Task";
import { AuthContext } from "../context/AuthContext";

const { confirm } = Modal;

const TaskList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token, setToken, openNotification } = useContext(AuthContext);
  const [addTaskModalFormOpen, setAddTaskModalFormOpen] = useState(false);
  const [editTaskModalFormOpen, setEditTaskModalFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [singleTask, setSingleTask] = useState({
    task_title: "",
    task_description: "",
    task_priority: "",
    task_status: "",
  });
  const [segmentValue, setSegmentValue] = useState("All Projects");
  const [preloadTask, setPreloadTask] = useState(null);
  const [preloading, setPreloading] = useState(true);
  const [editTask, setEditTask] = useState(null);

  const deleteTask = (task_id) => {
    setLoading(true);

    fetch(`${apiUrl}/Task/${task_id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("401 Unauthorized");
        }

        if (!response.ok) {
          throw Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setLoading(false);

        if (data.success) {
          const filterTask = taskList.filter((t) => t.task_id !== task_id);

          setTaskList(filterTask);
          openNotification("success", "Success", data.message);
        } else {
          openNotification("error", "Error", error.message);
        }
      })
      .catch((error) => {
        setLoading(false);

        if (error.message === "401 Unauthorized") {
          setToken(null);
          localStorage.removeItem("task-management-token");
          localStorage.removeItem("userDetail");
          openNotification("error", "Token has expired", "Please Login again");
        } else {
          openNotification("error", "Error", error.message);
        }

        console.log("Error message:", error.message);
      });
  };

  const showDeleteConfirm = (task_id) => {
    confirm({
      title: "Do you want to delete this task?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteTask(task_id);
      },
    });
  };

  const getTasks = () => {
    setLoading(true);

    fetch(`${apiUrl}/Task`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("401 Unauthorized");
        }

        if (!response.ok) {
          throw Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setLoading(false);
        setTaskList(data);
      })
      .catch((error) => {
        setLoading(false);

        if (error.message === "401 Unauthorized") {
          setToken(null);
          localStorage.removeItem("task-management-token");
          localStorage.removeItem("userDetail");
          openNotification("error", "Token has expired", "Please Login again");
        } else {
          openNotification("error", "Error", error.message);
        }

        console.log("Error message:", error.message);
      });
  };

  const onAddTask = () => {
    const { task_title, task_description, task_priority, task_status } =
      singleTask;

    if (!task_title || !task_description || !task_priority || !task_status) {
      openNotification(
        "error",
        "Error",
        "Please make sure Task Title, Description, Priority or Status is not blank"
      );

      return;
    }

    setLoading(true);

    fetch(`${apiUrl}/Task`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        task_Title: task_title,
        task_Description: task_description,
        task_Priority: task_priority,
        task_Status: task_status,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("401 Unauthorized");
        }

        if (!response.ok) {
          throw Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setLoading(false);

        if (data.success) {
          setTaskList([...taskList, data.taskItem]);
          setAddTaskModalFormOpen(false);
          setSingleTask({
            task_title: "",
            task_description: "",
            task_priority: "",
            task_status: "",
          });
          openNotification("success", "Success", data.message);
        }
      })
      .catch((error) => {
        setLoading(false);

        if (error.message === "401 Unauthorized") {
          setToken(null);
          localStorage.removeItem("task-management-token");
          localStorage.removeItem("userDetail");
          openNotification("error", "Token has expired", "Please Login again");
        } else {
          openNotification("error", "Error", error.message);
        }

        console.log("Error message:", error.message);
      });
  };

  const onEditTask = () => {
    const { task_Title, task_Description, task_Priority, task_Status } =
      editTask;

    if (!task_Title || !task_Description || !task_Priority || !task_Status) {
      openNotification(
        "error",
        "Error",
        "Please make sure Task Title, Description, Priority or Status is not blank"
      );

      return;
    }

    setLoading(true);

    fetch(`${apiUrl}/Task/${preloadTask.task_id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        task_Title: task_Title,
        task_Description: task_Description,
        task_Priority: task_Priority,
        task_Status: task_Status,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("401 Unauthorized");
        }

        if (!response.ok) {
          throw Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setLoading(false);

        if (data.success) {
          const taskListMapping = taskList.map((t) => {
            if (t.task_id === preloadTask.task_id) {
              return {
                ...t,
                task_Title: editTask.task_Title,
                task_Description: editTask.task_Description,
                task_Priority: editTask.task_Priority,
                task_Status: editTask.task_Status,
              };
            } else {
              return { ...t };
            }
          });

          setTaskList(taskListMapping);
          setEditTaskModalFormOpen(false);
          setPreloadTask(null);
          openNotification("success", "Success", data.message);
        } else {
          openNotification("error", "Error", error.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setEditTaskModalFormOpen(false);
        setPreloadTask(null);

        if (error.message === "401 Unauthorized") {
          setToken(null);
          localStorage.removeItem("task-management-token");
          localStorage.removeItem("userDetail");
          openNotification("error", "Token has expired", "Please Login again");
        } else {
          openNotification("error", "Error", error.message);
        }

        console.log("Error message:", error.message);
      });
  };

  const taskListDisplay = useMemo(() => {
    let filteredList;

    if (segmentValue === "Pending") {
      filteredList = taskList.filter((t) => t.task_Status === "pending");
    } else if (segmentValue === "In Progress") {
      filteredList = taskList.filter((t) => t.task_Status === "in-progress");
    } else if (segmentValue === "Completed") {
      filteredList = taskList.filter((t) => t.task_Status === "completed");
    } else {
      filteredList = taskList;
    }

    return filteredList;
  }, [taskList, segmentValue]);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (preloadTask) {
      setEditTask(preloadTask);
    } else {
      setEditTask(null);
    }
  }, [preloadTask]);

  return (
    <>
      <div style={{ marginBottom: 10, textAlign: "right" }}>
        <Button
          type="primary"
          onClick={() => {
            setAddTaskModalFormOpen(true);
          }}
        >
          Add Task
        </Button>
      </div>
      <Segmented
        id="task-list-segment"
        value={segmentValue}
        options={["All Projects", "Pending", "In Progress", "Completed"]}
        onChange={(value) => {
          setSegmentValue(value);
        }}
      />
      {loading ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={10} style={{ marginTop: 10 }}>
          {taskListDisplay.map((tl) => (
            <Task
              key={tl.task_id}
              {...tl}
              showDeleteConfirm={showDeleteConfirm}
              setEditTaskModalFormOpen={setEditTaskModalFormOpen}
              setPreloadTask={setPreloadTask}
              setPreloading={setPreloading}
            />
          ))}
        </Row>
      )}
      <AddTaskModal
        open={addTaskModalFormOpen}
        onOk={() => {
          onAddTask();
        }}
        onCancel={() => {
          setAddTaskModalFormOpen(false);
          setSingleTask({
            task_title: "",
            task_description: "",
            task_priority: "",
            task_status: "",
          });
        }}
        singleTask={singleTask}
        setSingleTask={setSingleTask}
      />
      <EditTaskModal
        open={editTaskModalFormOpen}
        onOk={() => {
          onEditTask();
        }}
        onCancel={() => {
          setEditTaskModalFormOpen(false);
          setPreloadTask(null);
        }}
        preloading={preloading}
        editTask={editTask}
        setEditTask={setEditTask}
      />
    </>
  );
};

export default TaskList;
