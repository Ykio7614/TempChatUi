import type { CurrentUser, RoomParticipant, RoomStatus, WsStatus } from "../types/api";
import type { TranslationKey } from "./i18n";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type TranslateFn = (key: TranslationKey, params?: Record<string, string | number>) => string;

export function formatDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatRoomStatus(status: RoomStatus, t: TranslateFn) {
  switch (status) {
    case "active":
      return t("status.room.active");
    case "closed":
      return t("status.room.closed");
    case "expired":
      return t("status.room.expired");
    case "waiting":
    default:
      return t("status.room.waiting");
  }
}

export function formatWsStatus(status: WsStatus, t: TranslateFn) {
  switch (status) {
    case "connected":
      return t("status.ws.connected");
    case "connecting":
      return t("status.ws.connecting");
    case "disconnected":
    default:
      return t("status.ws.disconnected");
  }
}

export function formatConnectionStatus(status: "connected" | "left", t: TranslateFn) {
  return status === "connected" ? t("status.connection.connected") : t("status.connection.left");
}

export function createParticipantNameMap(
  participants: Pick<RoomParticipant, "userId" | "nickname">[],
  currentUser: CurrentUser | null,
  t: TranslateFn,
) {
  const names = new Map<string, string>();
  let guestIndex = 1;

  for (const participant of participants) {
    if (currentUser?.id === participant.userId) {
      names.set(participant.userId, t("participant.you", { nickname: currentUser.nickname }));
      continue;
    }

    const nickname = participant.nickname?.trim();
    if (nickname) {
      names.set(participant.userId, nickname);
      continue;
    }

    names.set(participant.userId, t("participant.guest", { index: guestIndex }));
    guestIndex += 1;
  }

  if (currentUser && !names.has(currentUser.id)) {
    names.set(currentUser.id, t("participant.you", { nickname: currentUser.nickname }));
  }

  return names;
}

export function formatParticipantLabel(
  userId: string,
  participantNames: Map<string, string>,
  currentUser: CurrentUser | null,
  t: TranslateFn,
) {
  const displayName = participantNames.get(userId);
  if (displayName) {
    return displayName;
  }

  if (currentUser?.id === userId) {
    return t("participant.you", { nickname: currentUser.nickname });
  }

  return t("participant.guestUnknown");
}

export function participantSummary(
  participant: RoomParticipant,
  participantNames: Map<string, string>,
  currentUser: CurrentUser | null,
  t: TranslateFn,
) {
  const base = formatParticipantLabel(participant.userId, participantNames, currentUser, t);

  if (participant.role === "host") {
    return t("participant.host", { name: base });
  }

  return base;
}
