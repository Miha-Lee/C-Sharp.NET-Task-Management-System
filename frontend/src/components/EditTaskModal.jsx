import React, { memo } from "react";
import { Modal, Input, Select, Spin } from "antd";

const { TextArea } = Input;

const EditTaskModal = memo(
  ({ open, onOk, onCancel, preloading, editTask, setEditTask }) => {
    return (
      <Modal
        title="Edit Task"
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        okText="Save"
      >
        {preloading ? (
          <Spin size="large" style={{ width: "100%", textAlign: "center" }} />
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ margin: "0 10px 0 0" }}>Title:</p>
              <Input
                placeholder="Please input your title"
                value={editTask?.task_Title}
                onChange={(e) => {
                  setEditTask({ ...editTask, task_Title: e.target.value });
                }}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 10 }}
            >
              <p style={{ margin: "0 10px 0 0" }}>Description:</p>
              <TextArea
                placeholder="Please input your description"
                value={editTask?.task_Description}
                onChange={(e) => {
                  setEditTask({
                    ...editTask,
                    task_Description: e.target.value,
                  });
                }}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 10 }}
            >
              <p style={{ margin: "0 10px 0 0" }}>Priority:</p>
              <Select
                value={editTask?.task_Priority}
                style={{ width: "100%" }}
                options={[
                  {
                    label: "Low",
                    value: "low",
                  },
                  {
                    label: "Medium",
                    value: "medium",
                  },
                  {
                    label: "High",
                    value: "high",
                  },
                ]}
                onChange={(value) => {
                  setEditTask({ ...editTask, task_Priority: value });
                }}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 10 }}
            >
              <p style={{ margin: "0 10px 0 0" }}>Status:</p>
              <Select
                value={editTask?.task_Status}
                style={{ width: "100%" }}
                options={[
                  {
                    label: "Pending",
                    value: "pending",
                  },
                  {
                    label: "In Progress",
                    value: "in-progress",
                  },
                  {
                    label: "Completed",
                    value: "completed",
                  },
                ]}
                onChange={(value) => {
                  setEditTask({ ...editTask, task_Status: value });
                }}
              />
            </div>
          </>
        )}
      </Modal>
    );
  }
);

export default EditTaskModal;
