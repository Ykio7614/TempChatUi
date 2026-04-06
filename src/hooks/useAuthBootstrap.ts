import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";

export function useAuthBootstrap() {
  const initialize = useAuthStore((state) => state.initialize);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    void initialize();
  }, [initialize]);
}
