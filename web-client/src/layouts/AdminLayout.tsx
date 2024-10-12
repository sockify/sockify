import AdminNavbar from "@/components/AdminNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <main
        className={`mx-auto min-h-[calc(100vh-var(--navbar-height))] w-full max-w-full 2xl:container`}
      >
        <Outlet />
      </main>
      <footer>Admin footer</footer>
    </>
  );
}
