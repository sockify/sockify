import { useGetAdmins } from "@/api/admins/queries";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Users } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminHomePage() {
  const { data, isLoading, error, refetch } = useGetAdmins(25, 0, false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <h1 className="ml-2 mt-8 text-3xl font-bold underline">Admins</h1>
      <p>isAuthenticated? {isAuthenticated ? "true" : "false"}</p>

      <Button
        onClick={() => {
          refetch();
          toast("Fetching the admins...");
        }}
      >
        <Users className="mr-2 h-4 w-4" />
        Get admins
      </Button>

      <ul>
        {error && <div>Error: {error.message}</div>}

        {isLoading ? (
          <p>Loading...</p>
        ) : data && data.items.length > 0 ? (
          data.items.map((admin) => (
            <p key={admin.id}>
              {admin.username} ({admin.id})
            </p>
          ))
        ) : (
          <p>No admins found.</p>
        )}
      </ul>
    </>
  );
}
