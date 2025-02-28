import React, { useContext, useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigation = useNavigate();
  const { openNotification, setToken, setUserDetail } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const onLogin = (values) => {
    setLoading(true);

    fetch(`${apiUrl}/Auth/Login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setLoading(false);

        if (data.success) {
          openNotification("success", "Success", data.message);
          setToken(data.token);
          setUserDetail(data.userDetail);
          localStorage.setItem("task-management-token", data.token);
          localStorage.setItem("userDetail", JSON.stringify(data.userDetail));
          navigation("/");
        } else {
          openNotification("error", "Something Wrong", data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setToken(null);
        localStorage.removeItem("task-management-token");
        localStorage.removeItem("userDetail");
        openNotification(
          "error",
          "Something wrong on the server",
          "There is something wrong on the server, please verify it"
        );
        console.log("Error message:", error.message);
      });
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Login</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form
          name="login"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            width: "50%",
          }}
          autoComplete="off"
          onFinish={onLogin}
          disabled={loading}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email",
              },
              {
                type: "email",
                message: "Please input a valid email",
              },
            ]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Button
              type="link"
              onClick={() => {
                navigation("/register");
              }}
              disabled={loading}
            >
              Haven't registered?
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
