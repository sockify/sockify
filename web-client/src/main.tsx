import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthProtectedRoutes from "./components/AuthProtectedRoutes";
import NotFound from "./components/NotFound";
import UnderConstruction from "./components/UnderConstruction";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import AdminLayout from "./layouts/AdminLayout";
import RootLayout from "./layouts/RootLayout";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";

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
                <Route path="cart" element={<CartPage />} />

                {/* -- Post MVP -- */}
                <Route
                  path="about-us"
                  element={<UnderConstruction pageName="About us" />}
                />
                <Route
                  path="careers"
                  element={<UnderConstruction pageName="Careers" />}
                />
                <Route
                  path="support"
                  element={<UnderConstruction pageName="Support" />}
                />
                <Route
                  path="privacy-policy"
                  element={<UnderConstruction pageName="Privacy policy" />}
                />
                <Route
                  path="terms-of-service"
                  element={<UnderConstruction pageName="Terms of service" />}
                />

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
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="profile" element={<AdminProfilePage />} />

                  {/* -- Post MVP -- */}
                  <Route
                    path="team"
                    element={<UnderConstruction pageName="Team" />}
                  />

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
