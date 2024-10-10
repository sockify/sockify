import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/home");
    }
  }, [isAuthenticated]);

  return (
    <>
      <h1>Admin Login</h1>
      <p>isAuthenticated? {isAuthenticated ? "true" : "false"}</p>

      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        onClick={() => {
          if (!username?.length || !password?.length) {
            toast.error("Username and password are required to login.");
            return;
          }

          if (isAuthenticated) {
            toast.error("Already logged in.");
            return;
          }

          login(username, password);
        }}
        disabled={isLoading || isAuthenticated}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </>
  );
}
