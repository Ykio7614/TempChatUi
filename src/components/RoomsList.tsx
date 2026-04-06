import { useI18n } from "../hooks/useI18n";
import type { Room } from "../types/api";
import { formatDateTime, formatRoomStatus } from "../utils/format";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { StatusBadge } from "./ui/StatusBadge";

type RoomsListProps = {
  rooms: Room[];
  onOpen: (roomId: string) => void;
};

export function RoomsList({ rooms, onOpen }: RoomsListProps) {
  const { locale, t } = useI18n();

  return (
    <div className="room-list">
      {rooms.length === 0 ? (
        <Card>
          <h3 className="section-title">{t("rooms.emptyTitle")}</h3>
          <p className="muted-text">{t("rooms.emptyDescription")}</p>
        </Card>
      ) : (
        rooms.map((room) => (
          <Card key={room.id} className="room-card">
            <div className="room-card__header">
              <div>
                <p className="eyebrow">{t("rooms.roomCode")}</p>
                <h3>{room.code}</h3>
              </div>
              <StatusBadge
                label={formatRoomStatus(room.status, t)}
                tone={room.status === "active" ? "success" : room.status === "waiting" ? "warning" : "neutral"}
              />
            </div>
            <dl className="room-card__meta">
              <div>
                <dt>{t("rooms.participants")}</dt>
                <dd>
                  {room.participantCount}/{room.maxParticipants}
                </dd>
              </div>
              <div>
                <dt>{t("rooms.expires")}</dt>
                <dd>{formatDateTime(room.expiresAt, locale)}</dd>
              </div>
            </dl>
            <Button
              variant="secondary"
              onClick={() => onOpen(room.id)}
              disabled={room.status === "closed" || room.status === "expired"}
            >
              {t("rooms.openRoom")}
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
