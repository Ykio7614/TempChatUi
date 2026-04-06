import { Navigate, useLocation } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const status = useAuthStore((state) => state.status);

  if (status !== "authenticated") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
