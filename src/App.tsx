import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastViewport } from "./components/ui/ToastViewport";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Spinner } from "./components/ui/Spinner";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";
import { AuthPage } from "./pages/AuthPage";
import { LobbyPage } from "./pages/LobbyPage";
import { RoomPage } from "./pages/RoomPage";
import { useAuthStore } from "./store/authStore";
import { useRoomsStore } from "./store/roomsStore";

function AppNavigator() {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useAuthStore((state) => state.status);
  const currentRoomId = useRoomsStore((state) => state.currentRoomId);
  const restoreAttemptedRef = useRef(false);

  useEffect(() => {
    if (authStatus !== "authenticated") {
      restoreAttemptedRef.current = false;
      return;
    }

    if (restoreAttemptedRef.current) {
      return;
    }

    restoreAttemptedRef.current = true;

    if (location.pathname === "/" && currentRoomId) {
      navigate(`/rooms/${currentRoomId}`, { replace: true });
    }
  }, [authStatus, currentRoomId, location.pathname, navigate]);

  if (authStatus === "checking") {
    return (
      <main className="app-loader">
        <Spinner label="Restoring session..." />
      </main>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={authStatus === "authenticated" ? <LobbyPage /> : <AuthPage />} />
        <Route
          path="/rooms/:roomId"
          element={
            <ProtectedRoute>
              <RoomPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastViewport />
    </>
  );
}

export default function App() {
  useAuthBootstrap();

  return <AppNavigator />;
}
