import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomsList } from "../components/RoomsList";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useI18n } from "../hooks/useI18n";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { useRoomsStore } from "../store/roomsStore";
import { useUiStore } from "../store/uiStore";
import { getErrorMessage } from "../utils/errors";

export function LobbyPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const currentUser = useAuthStore((state) => state.currentUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const rooms = useRoomsStore((state) => state.rooms);
  const isLoadingRooms = useRoomsStore((state) => state.isLoadingRooms);
  const loadMyRooms = useRoomsStore((state) => state.loadMyRooms);
  const createRoom = useRoomsStore((state) => state.createRoom);
  const joinRoom = useRoomsStore((state) => state.joinRoom);
  const pushToast = useUiStore((state) => state.pushToast);
  const [maxParticipants, setMaxParticipants] = useState("5");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    void loadMyRooms().catch((error) => {
      pushToast(getErrorMessage(error, "errors.loadRooms"));
    });
  }, [loadMyRooms, pushToast]);

  const handleCreateRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const room = await createRoom(Number(maxParticipants) || 5);
      navigate(`/rooms/${room.id}`);
    } catch (error) {
      pushToast(getErrorMessage(error, "errors.createRoom"));
    }
  };

  const handleJoinRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const room = await joinRoom(joinCode.trim().toUpperCase());
      navigate(`/rooms/${room.id}`);
    } catch (error) {
      pushToast(getErrorMessage(error, "errors.joinRoom"));
    }
  };

  return (
    <main className="page page--lobby">
      <section className="page-header">
        <div>
          <p className="eyebrow">{t("lobby.eyebrow")}</p>
          <h1>{t("lobby.welcomeBack", { nickname: currentUser?.nickname ?? "" })}</h1>
          <p className="muted-text">{t("lobby.description")}</p>
        </div>
        <Button variant="ghost" onClick={clearSession}>
          {t("common.signOut")}
        </Button>
      </section>

      <section className="lobby-grid">
        <Card>
          <h2 className="section-title">{t("lobby.createRoomTitle")}</h2>
          <form className="stack-md" onSubmit={handleCreateRoom}>
            <label className="field">
              <span>{t("lobby.maxParticipants")}</span>
              <Input
                type="number"
                min={2}
                max={20}
                value={maxParticipants}
                onChange={(event) => setMaxParticipants(event.target.value)}
              />
            </label>
            <Button type="submit">{t("lobby.createRoom")}</Button>
          </form>
        </Card>

        <Card>
          <h2 className="section-title">{t("lobby.joinRoomTitle")}</h2>
          <form className="stack-md" onSubmit={handleJoinRoom}>
            <label className="field">
              <span>{t("lobby.roomCode")}</span>
              <Input
                value={joinCode}
                placeholder="ABCD"
                maxLength={12}
                onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
              />
            </label>
            <Button type="submit" variant="secondary">
              {t("lobby.joinRoom")}
            </Button>
          </form>
        </Card>
      </section>

      <section className="stack-md">
        <div className="section-header">
          <h2 className="section-title">{t("lobby.yourRooms")}</h2>
          <span className="section-caption">
            {isLoadingRooms ? t("lobby.roomsLoading") : t("lobby.roomsTotal", { count: rooms.length })}
          </span>
        </div>
        <RoomsList rooms={rooms} onOpen={(roomId) => navigate(`/rooms/${roomId}`)} />
      </section>
    </main>
  );
}
