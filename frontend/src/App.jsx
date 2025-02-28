import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeLayout from "./pages/HomeLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskList from "./pages/TaskList";
import PersonalInfo from "./pages/PersonalInfo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <TaskList />,
      },
      {
        path: "/personalInfo",
        element: <PersonalInfo />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
