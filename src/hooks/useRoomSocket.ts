import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wsClient } from "../services/wsClient";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { useRoomsStore } from "../store/roomsStore";
import { useUiStore } from "../store/uiStore";
import { getErrorMessage } from "../utils/errors";

export function useRoomSocket(roomId: string | undefined, enabled: boolean) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUserId = useAuthStore((state) => state.currentUser?.id);
  const setWsStatus = useChatStore((state) => state.setWsStatus);
  const addMessage = useChatStore((state) => state.addMessage);
  const markUserConnected = useChatStore((state) => state.markUserConnected);
  const markUserLeft = useChatStore((state) => state.markUserLeft);
  const setTyping = useChatStore((state) => state.setTyping);
  const setCurrentRoom = useRoomsStore((state) => state.setCurrentRoom);
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    if (!roomId || !accessToken || !enabled) {
      return;
    }

    const unsubscribeStatus = wsClient.subscribeStatus((status) => {
      setWsStatus(status);
    });

    const unsubscribeEvents = wsClient.subscribe((event) => {
      switch (event.type) {
        case "message.new":
          addMessage(event.payload);
          break;
        case "user.joined":
        case "user.reconnected":
          markUserConnected(event.payload);
          break;
        case "user.left":
          markUserLeft(event.payload);
          break;
        case "typing.start":
          if (event.payload.userId !== currentUserId) {
            setTyping(event.payload.userId, true);
          }
          break;
        case "typing.stop":
          setTyping(event.payload.userId, false);
          break;
        case "room.closed":
          setCurrentRoom(null);
          useChatStore.getState().reset();
          pushToast("Room was closed by the host.");
          navigate("/", { replace: true });
          break;
        case "error":
          pushToast(getErrorMessage(new Error(event.payload.message), event.payload.message));
          break;
        default:
          break;
      }
    });

    wsClient.connect(roomId, accessToken);

    return () => {
      unsubscribeStatus();
      unsubscribeEvents();
      wsClient.disconnect();
    };
  }, [
    accessToken,
    addMessage,
    currentUserId,
    enabled,
    markUserConnected,
    markUserLeft,
    navigate,
    pushToast,
    roomId,
    setCurrentRoom,
    setTyping,
    setWsStatus,
  ]);

  return {
    sendMessage(text: string) {
      wsClient.send({
        type: "message.send",
        payload: { text },
      });
    },
    startTyping() {
      wsClient.send({ type: "typing.start" });
    },
    stopTyping() {
      wsClient.send({ type: "typing.stop" });
    },
  };
}
