import React, { createContext, useState } from "react";
import { notification } from "antd";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("userDetail")
      ? localStorage.getItem("task-management-token")
      : null
  );
  const [mainLoading, setMainLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(
    localStorage.getItem("userDetail")
      ? JSON.parse(localStorage.getItem("userDetail"))
      : null
  );
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        openNotification,
        mainLoading,
        setMainLoading,
        userDetail,
        setUserDetail,
      }}
    >
      {contextHolder}
      {children}
    </AuthContext.Provider>
  );
};
