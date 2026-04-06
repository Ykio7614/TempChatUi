import type { CurrentUser, RoomParticipant, RoomStatus, WsStatus } from "../types/api";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatRoomStatus(status: RoomStatus) {
  switch (status) {
    case "active":
      return "Active";
    case "closed":
      return "Closed";
    case "expired":
      return "Expired";
    case "waiting":
    default:
      return "Waiting";
  }
}

export function formatWsStatus(status: WsStatus) {
  switch (status) {
    case "connected":
      return "Connected";
    case "connecting":
      return "Connecting";
    case "disconnected":
    default:
      return "Offline";
  }
}

export function formatParticipantLabel(userId: string, currentUser: CurrentUser | null) {
  if (currentUser?.id === userId) {
    return `${currentUser.nickname} (You)`;
  }

  return `User ${userId.slice(0, 8)}`;
}

export function participantSummary(participant: RoomParticipant, currentUser: CurrentUser | null) {
  const base = formatParticipantLabel(participant.userId, currentUser);

  if (participant.role === "host") {
    return `${base} · Host`;
  }

  return base;
}
