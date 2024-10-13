import AdminProfile from "@/components/AdminProfile";
import { useAuth } from "@/context/AuthContext";

export default function AdminProfilePage() {
  const { admin } = useAuth();

  return (
    <section className="px-4 py-4 md:px-8">
      {admin && <AdminProfile data={admin} />}
    </section>
  );
}
