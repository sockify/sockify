import { Button } from "./components/ui/button";
import { Users } from "lucide-react";
import { useGetUsers } from "./api/users/queries";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const { data: users, isLoading, error, refetch } = useGetUsers(false);

  return (
    <>
      <h1 className="ml-2 mt-8 text-3xl font-bold underline">Users</h1>
      <Button
        onClick={() => {
          refetch();
          toast("Fetching the users...");
        }}
      >
        <Users className="mr-2 h-4 w-4" />
        Get users
      </Button>

      <ul>
        {error && <div>Error: {error.message}</div>}

        {isLoading ? (
          <p>Loading...</p>
        ) : users && users.length > 0 ? (
          users.map((user) => (
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
