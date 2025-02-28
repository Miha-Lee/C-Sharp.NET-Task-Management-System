import React, { useContext, useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  const { openNotification } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const onRegister = (values) => {
    setLoading(true);

    fetch(`${apiUrl}/Auth/Register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        first_Name: values.firstName,
        last_Name: values.lastName,
        password: values.password,
        passwordConfirm: values.confirm_password,
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
          navigation("/login");
        } else {
          openNotification("error", "Something Wrong", data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
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
      <h1 style={{ textAlign: "center" }}>Register</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form
          name="register"
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
          disabled={loading}
          onFinish={onRegister}
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
            label="First Name"
            name="firstName"
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
            rules={[
              {
                required: true,
                message: "Please input your Last Name",
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
                message: "Please input your Password",
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
                message: "Please input your Confirm Password",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
          <div style={{ textAlign: "center" }}>
            <Button
              type="link"
              onClick={() => {
                navigation("/login");
              }}
              disabled={loading}
            >
              Already Registered, Please Login
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
