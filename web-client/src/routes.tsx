import { Navigate, createBrowserRouter } from "react-router-dom";

import AuthRoutes from "./components/AuthRoutes";
import NotFound from "./components/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // matches the root path
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true, // matches the root path
        element: <Navigate to="/admin/login" replace />,
      },
      {
        path: "login",
        element: <AdminLoginPage />,
      },
      {
        element: <AuthRoutes />,
        // All routes below require auth.
        children: [
          {
            path: "home",
            element: <AdminHomePage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
