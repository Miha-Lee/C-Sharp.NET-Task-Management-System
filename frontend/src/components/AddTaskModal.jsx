import React, { memo } from "react";
import { Modal, Input, Select } from "antd";

const { TextArea } = Input;

const AddTaskModal = memo(
  ({ open, onOk, onCancel, singleTask, setSingleTask }) => {
    return (
      <Modal
        title="Add Task"
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        okText="Save"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ margin: "0 10px 0 0" }}>Title:</p>
          <Input
            placeholder="Please input your title"
            value={singleTask.task_title}
            onChange={(e) => {
              setSingleTask({ ...singleTask, task_title: e.target.value });
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <p style={{ margin: "0 10px 0 0" }}>Description:</p>
          <TextArea
            placeholder="Please input your description"
            value={singleTask.task_description}
            onChange={(e) => {
              setSingleTask({
                ...singleTask,
                task_description: e.target.value,
              });
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <p style={{ margin: "0 10px 0 0" }}>Priority:</p>
          <Select
            style={{ width: "100%" }}
            value={singleTask.task_priority}
            onChange={(value) => {
              setSingleTask({ ...singleTask, task_priority: value });
            }}
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
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <p style={{ margin: "0 10px 0 0" }}>Status:</p>
          <Select
            style={{ width: "100%" }}
            value={singleTask.task_status}
            onChange={(value) => {
              setSingleTask({ ...singleTask, task_status: value });
            }}
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
          />
        </div>
      </Modal>
    );
  }
);

export default AddTaskModal;
