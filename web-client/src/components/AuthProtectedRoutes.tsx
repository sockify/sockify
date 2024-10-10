import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

interface AuthRouteProps {
  redirectPath?: string;
}

export default function AuthProtectedRoutes({
  redirectPath = "/admin/login",
}: AuthRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
