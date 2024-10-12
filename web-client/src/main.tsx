import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthProtectedRoutes from "./components/AuthProtectedRoutes";
import NotFound from "./components/NotFound";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import AdminLayout from "./layouts/AdminLayout";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              {/* ----- User facing routes (no auth) ----- */}
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<HomePage />} />

                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* ----- Admin dashboard ----- */}
              <Route element={<AuthProtectedRoutes />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route
                    index
                    element={<Navigate to="/admin/home" replace />}
                  />
                  {/* For MVP, the inventory page will acts as the home page. */}
                  <Route
                    path="home"
                    element={<Navigate to="/admin/inventory" replace />}
                  />
                  <Route path="inventory" element={<AdminInventoryPage />} />

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>

      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
