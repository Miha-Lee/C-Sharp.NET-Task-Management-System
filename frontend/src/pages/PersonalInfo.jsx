import React, { useEffect, useState, useContext } from "react";
import { Form, Input, Button, Spin } from "antd";
import { AuthContext } from "../context/AuthContext";

const PersonalInfo = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { openNotification, token, setToken, userDetail, setUserDetail } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [userCheck, setUserCheck] = useState(null);

  const getUserDetail = () => {
    setLoading(true);

    fetch(`${apiUrl}/Auth/UserDetail`, {
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

        if (data.success) {
          setUserDetail(data.userDetail);
          localStorage.setItem("userDetail", JSON.stringify(data.userDetail));
        } else {
          setUserCheck("User cannot be found");
          setToken(null);
          localStorage.removeItem("task-management-token");
          localStorage.removeItem("userDetail");
          openNotification("error", "Error", data.message);
        }
      })
      .catch((error) => {
        setLoading(false);

        if (error.message === "401 Unauthorized") {
          setToken(null);
          setUserCheck("Token has exipred, please Login again");
          localStorage.removeItem("task-management-token");
          localStorage.removeItem("userDetail");
          openNotification("error", "Token has expired", "Please Login again");
        } else {
          setUserCheck("There is the server error");
        }

        console.log("Error message:", error.message);
      });
  };

  const onUpdateUserDetail = (values) => {
    setLoading(true);

    fetch(`${apiUrl}/Auth/UpdateUserDetail`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_Name: values.firstName,
        last_Name: values.lastName,
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
          setUserDetail(data.userDetail);
          localStorage.setItem("userDetail", JSON.stringify(data.userDetail));
          openNotification("success", "Success", data.message);
        } else {
          openNotification("error", "Please Login again", data.message);
        }
      })
      .catch((error) => {
        setLoading(false);

        if (error.message === "401 Unauthorized") {
          setToken(null);
          setUserCheck("Token has exipred, please Login again");
          localStorage.removeItem("task-management-token");
          localStorage.removeItem("userDetail");
          openNotification("error", "Token has expired", "Please Login again");
        } else {
          openNotification("error", "Something Wrong", error.message);
        }

        console.log("Error message:", error.message);
      });
  };

  const onResetPassword = (values) => {
    setLoading(true);

    fetch(`${apiUrl}/Auth/ResetPassword`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: values.password,
        confirmPassword: values.confirm_password,
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
          openNotification("success", "Success", data.message);
        } else {
          openNotification("error", data.title, data.message);
        }
      })
      .catch((error) => {
        setLoading(false);

        if (error.message === "401 Unauthorized") {
          setToken(null);
          setUserCheck("Token has exipred, please Login again");
          localStorage.removeItem("task-management-token");
          localStorage.removeItem("userDetail");
          openNotification("error", "Token has expired", "Please Login again");
        } else {
          openNotification("error", "Something Wrong", error.message);
        }

        console.log("Error message:", error.message);
      });
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  if (loading) {
    return (
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
    );
  }

  if (userCheck !== null) {
    return <h1 style={{ textAlign: "center" }}>{userCheck}</h1>;
  }

  return (
    <>
      <Form
        name="personal-info"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
        onFinish={onUpdateUserDetail}
        disabled={loading}
      >
        <Form.Item label="Email" name="email" initialValue={userDetail.email}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="First Name"
          name="firstName"
          initialValue={userDetail.first_Name}
          rules={[
            {
              required: true,
              message: "Please input your First Name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          initialValue={userDetail.last_Name}
          rules={[
            {
              required: true,
              message: "Please input your Last Name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
      <Form
        name="reset-password"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
        onFinish={onResetPassword}
        disabled={loading}
      >
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirm_password"
          rules={[
            {
              required: true,
              message: "Please input your confirm password",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default PersonalInfo;
