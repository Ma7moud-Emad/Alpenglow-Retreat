import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GlobalStyles from "./styles/GlobalStyles";
import ThemeProvider from "./context/ThemeProvider";
import AuthProvider from "./context/AuthProvider";
import ErrorBoundary from "./ui/ErrorBoundary";
import ProtectedRoute from "./layout/ProtectedRoute";
import Spinner from "./ui/Spinner";

// The public site is what most visitors load, so its shell and landing page
// stay in the main bundle. Everything behind the login is split out.
import SiteLayout from "./site/SiteLayout";
import Home from "./site/pages/Home";

const Rooms = lazy(() => import("./site/pages/Rooms"));
const RoomDetail = lazy(() => import("./site/pages/RoomDetail"));
const Experience = lazy(() => import("./site/pages/Experience"));
const Contact = lazy(() => import("./site/pages/Contact"));

const SignIn = lazy(() => import("./pages/SignIn"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AppLayout = lazy(() => import("./layout/AppLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Requests = lazy(() => import("./pages/Requests"));
const Bookings = lazy(() => import("./pages/Bookings"));
const BookingDetail = lazy(() => import("./pages/BookingDetail"));
const CheckIn = lazy(() => import("./pages/CheckIn"));
const Cabins = lazy(() => import("./pages/Cabins"));
const Settings = lazy(() => import("./pages/Settings"));
const Team = lazy(() => import("./pages/Team"));
const Account = lazy(() => import("./pages/Account"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // `cacheTime` was renamed in React Query v5. The old key was silently
      // ignored, so cached data was being collected on the default schedule.
      gcTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    // Mutations report through toasts in their own hooks. The previous global
    // handler fired a blocking window.alert() on every success and failure.
  },
});

const fallback = (
  <div
    style={{
      display: "grid",
      placeItems: "center",
      minHeight: "60dvh",
      color: "var(--accent)",
    }}
    role="status"
    aria-label="Loading"
  >
    <Spinner $size="3.2rem" />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GlobalStyles />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={fallback}>
                <Routes>
                  {/* ---- public marketing site ---- */}
                  <Route element={<SiteLayout />}>
                    <Route index element={<Home />} />
                    <Route path="rooms" element={<Rooms />} />
                    <Route path="rooms/:slug" element={<RoomDetail />} />
                    <Route path="experience" element={<Experience />} />
                    <Route path="contact" element={<Contact />} />
                  </Route>

                  {/* ---- staff dashboard ---- */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="requests" element={<Requests />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="bookings/:bookingId" element={<BookingDetail />} />
                    <Route path="checkin/:bookingId" element={<CheckIn />} />
                    <Route path="cabins" element={<Cabins />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="account" element={<Account />} />
                    <Route
                      path="team"
                      element={
                        <ProtectedRoute requireAdmin>
                          <Team />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* Old top-level dashboard URLs, kept working. */}
                  <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/bookings/*" element={<Navigate to="/admin/bookings" replace />} />
                  <Route path="/cabins" element={<Navigate to="/admin/cabins" replace />} />
                  <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
                  <Route path="/account" element={<Navigate to="/admin/account" replace />} />

                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

              <ToastContainer
                position="bottom-right"
                newestOnTop
                closeOnClick
                aria-label="Notifications"
              />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
