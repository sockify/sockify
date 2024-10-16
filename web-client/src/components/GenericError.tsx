import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
  AlertTriangle,
  ArrowLeft,
  MessageCircle,
  RefreshCcw,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import LoadingSpinner from "./LoadingSpinner";

interface ErrorProps {
  title?: string;
  message?: string;
  customContent?: ReactNode;
  showRefresh?: boolean;
  showContactSupport?: boolean;
  showReturnHome?: boolean;
}

export default function GenericError({
  title = "An error occurred",
  message = "We're sorry, but something went wrong. Please try again or contact support if the issue persists.",
  customContent,
  showRefresh = true,
  showContactSupport = true,
  showReturnHome = true,
}: ErrorProps) {
  const { isAuthenticated } = useAuth();
  const isAdminPath = window.location.pathname.startsWith("/admin");
  const homePath = isAuthenticated && isAdminPath ? "/admin/home" : "/home";

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="flex h-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">{message}</p>
          {customContent && (
            <div className="rounded-lg bg-muted p-4">{customContent}</div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          {showRefresh && (
            <Button
              className="w-full"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <LoadingSpinner size={16} className="mr-2" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          )}
          {showContactSupport && (
            <Button variant="outline" className="w-full" asChild>
              <Link to="/support">
                <MessageCircle className="mr-2 h-4 w-4" /> Contact support
              </Link>
            </Button>
          )}
          {showReturnHome && (
            <Button variant="ghost" className="w-full" asChild>
              <Link to={homePath}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to home
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
