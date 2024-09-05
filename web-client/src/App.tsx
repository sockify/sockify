import { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { Button } from "./components/ui/button";
import { Users } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function App() {
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, status, statusText } = await axios.get("/api/v1/users");
        if (status !== HttpStatusCode.Ok) {
          setError("Unable to fetch users -> " + statusText);
          return;
        }
        toast.success("Successfully retrieved users!");
        setUsers(data);
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold underline">Users</h1>
      <Button>
        <Users className="mr-2 h-4 w-4" />
        Get users
      </Button>

      <ul>
        {users && users.length > 0 ? (
          users.map(user => (
            <p key={user.id}>
              {user.username} ({user.id})
            </p>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>

      <Toaster position="top-right" />
    </>
  );
}
