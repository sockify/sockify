import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from "@/shared/constants";
import { Navigate, Outlet } from "react-router-dom";

interface AuthRouteProps {
  redirectPath?: string;
}

export default function AuthRoutes({
  redirectPath = "/admin/login",
}: AuthRouteProps) {
  const token = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
