import { useEffect, useRef } from "react";
import type { ChatMessage, CurrentUser } from "../types/api";
import { formatParticipantLabel, formatTime } from "../utils/format";

type MessageListProps = {
  messages: ChatMessage[];
  currentUser: CurrentUser | null;
};

export function MessageList({ messages, currentUser }: MessageListProps) {
  const tailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    tailRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="message-list__empty">
          <p>No messages yet.</p>
          <span>Say hello to start the room.</span>
        </div>
      ) : (
        messages.map((message) => {
          const isOwn = message.senderUserId === currentUser?.id;

          return (
            <article key={message.id} className={`message-bubble ${isOwn ? "message-bubble--own" : ""}`}>
              <header className="message-bubble__header">
                <strong>{formatParticipantLabel(message.senderUserId, currentUser)}</strong>
                <span>{formatTime(message.createdAt)}</span>
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
