import { useEffect, useMemo, useRef } from "react";
import { useI18n } from "../hooks/useI18n";
import type { ChatMessage, CurrentUser, RoomParticipant } from "../types/api";
import { createParticipantNameMap, formatParticipantLabel, formatTime } from "../utils/format";

type MessageListProps = {
  messages: ChatMessage[];
  currentUser: CurrentUser | null;
  participants: RoomParticipant[];
};

export function MessageList({ messages, currentUser, participants }: MessageListProps) {
  const { locale, t } = useI18n();
  const tailRef = useRef<HTMLDivElement | null>(null);
  const participantNames = useMemo(
    () => createParticipantNameMap(participants, currentUser, t),
    [currentUser, participants, t],
  );

  useEffect(() => {
    tailRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="message-list__empty">
          <p>{t("messages.emptyTitle")}</p>
          <span>{t("messages.emptyDescription")}</span>
        </div>
      ) : (
        messages.map((message) => {
          const isOwn = message.senderUserId === currentUser?.id;

          return (
            <article key={message.id} className={`message-bubble ${isOwn ? "message-bubble--own" : ""}`}>
              <header className="message-bubble__header">
                <strong>{formatParticipantLabel(message.senderUserId, participantNames, currentUser, t)}</strong>
                <span>{formatTime(message.createdAt, locale)}</span>
              </header>
              <p>{message.text}</p>
            </article>
          );
        })
      )}
      <div ref={tailRef} />
    </div>
  );
}
