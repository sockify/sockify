import { Navigate, createBrowserRouter } from "react-router-dom";

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
        path: "home",
        // TODO: should be guarded using a <AuthRoute />
        element: <AdminHomePage />,
      },
    ],
  },
  {
    path: "*",
    // TODO: create 404 page
    element: <div>404 - Not Found</div>,
  },
]);
