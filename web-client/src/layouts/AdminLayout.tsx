import AdminFooter from "@/components/AdminFooter";
import AdminNavbar from "@/components/AdminNavbar";
import DemoDisclaimerBanner from "@/components/DemoDisclaimerBanner";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <DemoDisclaimerBanner />

      <AdminNavbar />
      <main
        className={`mx-auto min-h-[calc(100vh-var(--navbar-height))] w-full max-w-full 2xl:container`}
      >
        <Outlet />
      </main>
      <AdminFooter />
    </>
  );
}
