import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main
        className={`mx-auto min-h-[calc(100vh-var(--navbar-height))] w-full max-w-full 2xl:container`}
      >
        <Outlet />
      </main>
      <footer>Footer</footer>
    </>
  );
}
