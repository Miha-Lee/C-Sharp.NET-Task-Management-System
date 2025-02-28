import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import { Spin } from "antd";
import Navbar from "../components/Navbar";

const HomeLayout = () => {
  const { token, mainLoading } = useContext(AuthContext);

  if (mainLoading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ height: "100%" }}>
          <div className="task-content" style={{ height: "100%" }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin size="large" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ height: "100%" }}>
        <div className="task-content" style={{ height: "100%" }}>
          {token ? <Outlet /> : <Navigate to="/login" />}
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
