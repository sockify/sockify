import { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";

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
      <h1>Users</h1>
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
    </>
  );
}
