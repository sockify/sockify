import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthRoutes from "./components/AuthRoutes";
import NotFound from "./components/NotFound";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import AdminLayout from "./layouts/AdminLayout";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<HomePage />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/login" replace />} />
              <Route path="login" element={<AdminLoginPage />} />

              {/* Protected Routes */}
              <Route element={<AuthRoutes />}>
                <Route path="home" element={<AdminHomePage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>

      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
