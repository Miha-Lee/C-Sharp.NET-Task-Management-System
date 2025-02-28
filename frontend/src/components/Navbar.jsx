import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Popconfirm } from "antd";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const {
    setToken,
    openNotification,
    setMainLoading,
    userDetail,
    setUserDetail,
  } = useContext(AuthContext);

  return (
    <header>
      <div className="container">
        <div className="inner-content">
          <div className="brand">
            <Link to="/">Task Management System</Link>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/personalInfo">
                {userDetail?.first_Name} {userDetail?.last_Name}
              </Link>
            </li>
            <li>
              <Popconfirm
                title="Logout"
                description="Are you sure you want to logout?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  setMainLoading(true);

                  setTimeout(() => {
                    setMainLoading(false);
                    localStorage.removeItem("task-management-token");
                    localStorage.removeItem("userDetail");
                    setToken(null);
                    setUserDetail(null);
                    openNotification(
                      "success",
                      "Success",
                      "Logout Successfully"
                    );
                  }, 2000);
                }}
              >
                <span>Logout</span>
              </Popconfirm>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
