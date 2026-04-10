import { useMemo } from "react";
import { useI18n } from "../hooks/useI18n";
import type { CurrentUser, RoomParticipant } from "../types/api";
import { createParticipantNameMap, formatConnectionStatus, formatDateTime, participantSummary } from "../utils/format";
import { Card } from "./ui/Card";
import { StatusBadge } from "./ui/StatusBadge";

type RoomParticipantsProps = {
  participants: RoomParticipant[];
  currentUser: CurrentUser | null;
  typingUserIds: string[];
};

export function RoomParticipants({ participants, currentUser, typingUserIds }: RoomParticipantsProps) {
  const { locale, t } = useI18n();
  const participantNames = useMemo(
    () => createParticipantNameMap(participants, currentUser, t),
    [currentUser, participants, t],
  );

  return (
    <Card className="sidebar-card">
      <div className="section-header">
        <h3 className="section-title">{t("participants.title")}</h3>
        <span className="section-caption">{participants.length}</span>
      </div>
      <ul className="participant-list">
        {participants.map((participant) => (
          <li key={participant.userId} className="participant-list__item">
            <div>
              <strong>{participantSummary(participant, participantNames, currentUser, t)}</strong>
              <p className="muted-text">
                {t("participants.lastSeen", { date: formatDateTime(participant.lastSeenAt, locale) })}
                {typingUserIds.includes(participant.userId) ? ` · ${t("participants.typing")}` : ""}
              </p>
            </div>
            <StatusBadge
              label={formatConnectionStatus(participant.connectionStatus, t)}
              tone={participant.connectionStatus === "connected" ? "success" : "neutral"}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
