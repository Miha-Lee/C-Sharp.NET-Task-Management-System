import React, { memo, useMemo, useContext } from "react";
import { Col, Card, Tag, Flex, Button } from "antd";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";

const Task = memo(
  ({
    userName,
    task_Title,
    task_Description,
    task_Priority,
    task_Status,
    created_at,
    task_id,
    showDeleteConfirm,
    setEditTaskModalFormOpen,
    setPreloadTask,
    setPreloading,
  }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { token, setToken, openNotification } = useContext(AuthContext);

    const taskPriority = useMemo(() => {
      let taskPriority;

      if (task_Priority === "low") {
        taskPriority = {
          title: "Low",
          color: "cyan",
        };
      } else if (task_Priority === "medium") {
        taskPriority = {
          title: "Medium",
          color: "volcano",
        };
      } else {
        taskPriority = {
          title: "High",
          color: "red",
        };
      }

      return (
        <Tag bordered={false} color={taskPriority.color}>
          {taskPriority.title}
        </Tag>
      );
    }, [task_Priority]);

    const taskStatus = useMemo(() => {
      let taskStatus;

      if (task_Status === "pending") {
        taskStatus = {
          title: "Pending",
          color: "warning",
        };
      } else if (task_Status === "in-progress") {
        taskStatus = {
          title: "In Progress",
          color: "processing",
        };
      } else {
        taskStatus = {
          title: "Completed",
          color: "success",
        };
      }

      return (
        <Tag bordered={false} color={taskStatus.color}>
          {taskStatus.title}
        </Tag>
      );
    }, [task_Status]);

    const preloadTask = () => {
      setPreloading(true);

      fetch(`${apiUrl}/Task/${task_id}`, {
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
          setPreloading(false);
          setPreloadTask(data);
        })
        .catch((error) => {
          setPreloading(false);
          setPreloadTask(null);
          setEditTaskModalFormOpen(false);

          if (error.message === "401 Unauthorized") {
            setToken(null);
            localStorage.removeItem("task-management-token");
            localStorage.removeItem("userDetail");
            openNotification(
              "error",
              "Token has expired",
              "Please Login again"
            );
          } else {
            openNotification("error", "Error", error.message);
          }

          console.log("Error message:", error.message);
        });
    };

    return (
      <Col xs={24} lg={8} style={{ marginBottom: 10 }}>
        <Card
          title={task_Title}
          bordered={false}
          style={{ wordBreak: "break-word" }}
        >
          <p style={{ marginTop: 0 }}>Description: {task_Description}</p>
          <p>Priority: {taskPriority}</p>
          <p>Status: {taskStatus}</p>
          <p>Created by: {userName}</p>
          <p>Created Date: {moment(created_at).format("YYYY.MM.DD")}</p>
          <Flex gap="small" style={{ justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                setEditTaskModalFormOpen(true);
                preloadTask();
              }}
            >
              Edit
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                showDeleteConfirm(task_id);
              }}
            >
              Delete
            </Button>
          </Flex>
        </Card>
      </Col>
    );
  }
);

export default Task;
