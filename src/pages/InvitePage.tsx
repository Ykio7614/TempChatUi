import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../components/ui/Spinner";
import { useI18n } from "../hooks/useI18n";
import { useRoomsStore } from "../store/roomsStore";
import { useUiStore } from "../store/uiStore";
import { getErrorMessage } from "../utils/errors";

export function InvitePage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const { t } = useI18n();
  const joinRoom = useRoomsStore((state) => state.joinRoom);
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    if (!roomCode) {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;

    void joinRoom(roomCode.toUpperCase())
      .then((room) => {
        if (!isMounted) {
          return;
        }

        navigate(`/rooms/${room.id}`, { replace: true });
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        pushToast(getErrorMessage(error, "errors.joinRoom"));
        navigate("/", { replace: true });
      });

    return () => {
      isMounted = false;
    };
  }, [joinRoom, navigate, pushToast, roomCode]);

  return (
    <main className="page page--centered">
      <Spinner label={t("invite.joining")} />
    </main>
  );
}
