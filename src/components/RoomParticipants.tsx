import type { CurrentUser, RoomParticipant } from "../types/api";
import { formatDateTime, participantSummary } from "../utils/format";
import { Card } from "./ui/Card";
import { StatusBadge } from "./ui/StatusBadge";

type RoomParticipantsProps = {
  participants: RoomParticipant[];
  currentUser: CurrentUser | null;
  typingUserIds: string[];
};

export function RoomParticipants({ participants, currentUser, typingUserIds }: RoomParticipantsProps) {
  return (
    <Card className="sidebar-card">
      <div className="section-header">
        <h3 className="section-title">Participants</h3>
        <span className="section-caption">{participants.length}</span>
      </div>
      <ul className="participant-list">
        {participants.map((participant) => (
          <li key={participant.userId} className="participant-list__item">
            <div>
              <strong>{participantSummary(participant, currentUser)}</strong>
              <p className="muted-text">
                Last seen {formatDateTime(participant.lastSeenAt)}
                {typingUserIds.includes(participant.userId) ? " · typing..." : ""}
              </p>
            </div>
            <StatusBadge
              label={participant.connectionStatus}
              tone={participant.connectionStatus === "connected" ? "success" : "neutral"}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
