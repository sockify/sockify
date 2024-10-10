import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <header>Admin header</header>
      <main>
        <Outlet />
      </main>
      <footer>Admin footer</footer>
    </>
  );
}
