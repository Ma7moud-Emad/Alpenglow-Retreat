import { Navigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import Spinner from "../ui/Spinner";

const FullPage = styled.div`
  display: grid;
  place-items: center;
  min-height: 100dvh;
  color: var(--accent);
`;

/**
 * Gate for authenticated routes.
 *
 * The old guard tested `localStorage["sb-...-auth-token"]` for truthiness,
 * which let an expired (or hand-written) value through. This waits for the
 * real session and, when `requireAdmin` is set, for the staff role too.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <FullPage role="status" aria-label="Checking your session">
        <Spinner $size="3.2rem" />
      </FullPage>
    );
  }

  if (!isAuthenticated) {
    // Remember where they were headed so sign-in can return them there.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
