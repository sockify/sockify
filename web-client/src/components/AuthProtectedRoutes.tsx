import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

import LoadingSpinner from "./LoadingSpinner";

interface AuthRouteProps {
  redirectPath?: string;
}

export default function AuthProtectedRoutes({
  redirectPath = "/admin/login",
}: AuthRouteProps) {
  const { isAuthenticated, isFetchingToken } = useAuth();

  if (isFetchingToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-primary">
        <LoadingSpinner size={48} />
        <p className="ml-3 mt-2 text-lg text-gray-700">Authorizing...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
