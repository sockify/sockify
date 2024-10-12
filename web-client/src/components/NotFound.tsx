import { useAuth } from "@/context/AuthContext";
import { Home, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "./ui/button";

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isAdminPath = window.location.pathname.startsWith("/admin");
  const homePath = isAuthenticated && isAdminPath ? "/admin/home" : "/home";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <header className="space-y-2">
          <h1 className="text-7xl font-extrabold text-primary">404</h1>
          <p className="text-2xl font-semibold text-foreground">
            Oops! Page not found
          </p>
        </header>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              It seems you've wandered off the path
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. Don't
            worry, even the best explorers sometimes lose their way!
          </p>

          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button variant="outline" onClick={() => window.history.back()}>
              <Undo2 className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button onClick={() => navigate(homePath)}>
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </div>
        </div>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              Lost socks and lost pages - at least one of these we can help you
              find!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
