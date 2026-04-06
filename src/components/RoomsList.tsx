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
  return (
    <div className="room-list">
      {rooms.length === 0 ? (
        <Card>
          <h3 className="section-title">No rooms yet</h3>
          <p className="muted-text">Create your first temporary room to start chatting.</p>
        </Card>
      ) : (
        rooms.map((room) => (
          <Card key={room.id} className="room-card">
            <div className="room-card__header">
              <div>
                <p className="eyebrow">Room code</p>
                <h3>{room.code}</h3>
              </div>
              <StatusBadge
                label={formatRoomStatus(room.status)}
                tone={room.status === "active" ? "success" : room.status === "waiting" ? "warning" : "neutral"}
              />
            </div>
            <dl className="room-card__meta">
              <div>
                <dt>Participants</dt>
                <dd>
                  {room.participantCount}/{room.maxParticipants}
                </dd>
              </div>
              <div>
                <dt>Expires</dt>
                <dd>{formatDateTime(room.expiresAt)}</dd>
              </div>
            </dl>
            <Button
              variant="secondary"
              onClick={() => onOpen(room.id)}
              disabled={room.status === "closed" || room.status === "expired"}
            >
              Open room
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
