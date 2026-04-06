import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageList } from "../components/MessageList";
import { RoomComposer } from "../components/RoomComposer";
import { RoomParticipants } from "../components/RoomParticipants";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useRoomSocket } from "../hooks/useRoomSocket";
import { roomsService } from "../services/roomsService";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { useRoomsStore } from "../store/roomsStore";
import { useUiStore } from "../store/uiStore";
import { getErrorMessage } from "../utils/errors";
import { formatDateTime, formatRoomStatus, formatWsStatus } from "../utils/format";

type RoomLoadState = "loading" | "ready" | "error";

export function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentRoom = useRoomsStore((state) => state.currentRoom);
  const loadRoom = useRoomsStore((state) => state.loadRoom);
  const leaveRoom = useRoomsStore((state) => state.leaveRoom);
  const closeRoom = useRoomsStore((state) => state.closeRoom);
  const participants = useChatStore((state) => state.participants);
  const messages = useChatStore((state) => state.messages);
  const typingUserIds = useChatStore((state) => state.typingUserIds);
  const wsStatus = useChatStore((state) => state.wsStatus);
  const hydrateRoom = useChatStore((state) => state.hydrateRoom);
  const resetChat = useChatStore((state) => state.reset);
  const pushToast = useUiStore((state) => state.pushToast);
  const [loadState, setLoadState] = useState<RoomLoadState>("loading");

  const { sendMessage, startTyping, stopTyping } = useRoomSocket(roomId, loadState === "ready");

  useEffect(() => {
    if (!roomId) {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;
    setLoadState("loading");

    void Promise.all([loadRoom(roomId), roomsService.loadRoomSnapshot(roomId)])
      .then(([room, [roomParticipants, roomMessages]]) => {
        if (!isMounted) {
          return;
        }

        hydrateRoom(roomParticipants, roomMessages);
        useRoomsStore.getState().setCurrentRoom(room);
        setLoadState("ready");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        useRoomsStore.getState().setCurrentRoom(null);
        resetChat();
        setLoadState("error");
        pushToast(getErrorMessage(error, "Could not open room."));
        navigate("/", { replace: true });
      });

    return () => {
      isMounted = false;
      resetChat();
    };
  }, [hydrateRoom, loadRoom, navigate, pushToast, resetChat, roomId]);

  const isHost = useMemo(() => currentRoom?.hostUserId === currentUser?.id, [currentRoom, currentUser?.id]);

  if (loadState === "loading" || !currentRoom) {
    return (
      <main className="page page--centered">
        <Spinner label="Loading room..." />
      </main>
    );
  }

  return (
    <main className="page page--room">
      <section className="room-layout">
        <Card className="room-main">
          <header className="room-header">
            <div>
              <p className="eyebrow">Room code</p>
              <h1>{currentRoom.code}</h1>
              <p className="muted-text">Expires {formatDateTime(currentRoom.expiresAt)}</p>
            </div>
            <div className="room-header__meta">
              <StatusBadge
                label={formatRoomStatus(currentRoom.status)}
                tone={currentRoom.status === "active" ? "success" : currentRoom.status === "waiting" ? "warning" : "neutral"}
              />
              <StatusBadge
                label={formatWsStatus(wsStatus)}
                tone={wsStatus === "connected" ? "success" : wsStatus === "connecting" ? "warning" : "danger"}
              />
            </div>
          </header>

          <MessageList messages={messages} currentUser={currentUser} />

          <footer className="room-footer">
            {typingUserIds.length > 0 ? (
              <p className="typing-indicator">
                {typingUserIds.length === 1 ? "1 participant is typing..." : `${typingUserIds.length} participants are typing...`}
              </p>
            ) : (
              <p className="typing-indicator typing-indicator--idle">No one is typing right now.</p>
            )}
            <RoomComposer
              disabled={wsStatus !== "connected"}
              onSend={(text) => {
                try {
                  sendMessage(text);
                } catch (error) {
                  pushToast(getErrorMessage(error, "Could not send message."));
                }
              }}
              onTypingStart={() => {
                try {
                  startTyping();
                } catch {
                  return;
                }
              }}
              onTypingStop={() => {
                try {
                  stopTyping();
                } catch {
                  return;
                }
              }}
            />
          </footer>
        </Card>

        <aside className="room-sidebar">
          <RoomParticipants participants={participants} currentUser={currentUser} typingUserIds={typingUserIds} />
          <Card className="sidebar-card">
            <div className="section-header">
              <h3 className="section-title">Room actions</h3>
              <span className="section-caption">
                {currentRoom.participantCount}/{currentRoom.maxParticipants}
              </span>
            </div>
            <div className="stack-sm">
              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    await leaveRoom(currentRoom.id);
                    resetChat();
                    navigate("/", { replace: true });
                  } catch (error) {
                    pushToast(getErrorMessage(error, "Could not leave room."));
                  }
                }}
              >
                Leave room
              </Button>
              {isHost ? (
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await closeRoom(currentRoom.id);
                      resetChat();
                      navigate("/", { replace: true });
                    } catch (error) {
                      pushToast(getErrorMessage(error, "Could not close room."));
                    }
                  }}
                >
                  Close room
                </Button>
              ) : null}
            </div>
          </Card>
        </aside>
      </section>
    </main>
  );
}
