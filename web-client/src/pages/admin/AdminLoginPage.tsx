import { useAdminLoginMutation } from "@/api/admins/queries";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginMutation = useAdminLoginMutation();

  return (
    <>
      <h1>Admin Login</h1>

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

          loginMutation.mutate({ username, password });
        }}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </>
  );
}
