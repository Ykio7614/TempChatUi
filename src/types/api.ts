export type AuthStatus = "anonymous" | "checking" | "authenticated";
export type WsStatus = "connecting" | "connected" | "disconnected";
export type RoomStatus = "waiting" | "active" | "closed" | "expired";
export type ParticipantRole = "host" | "member";
export type ParticipantConnectionStatus = "connected" | "left";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  timeStamp: string;
  userAgent: string;
}

export interface CurrentUser {
  id: string;
  nickname: string;
  createdAt: string;
}

export interface Room {
  id: string;
  code: string;
  hostUserId: string;
  status: RoomStatus;
  maxParticipants: number;
  participantCount: number;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
}

export interface JoinRoomResponse {
  room: Room;
  reconnected: boolean;
}

export interface RoomsResponse {
  rooms: Room[];
}

export interface RoomParticipant {
  roomId: string;
  userId: string;
  role: ParticipantRole;
  connectionStatus: ParticipantConnectionStatus;
  joinedAt: string;
  lastSeenAt: string;
  leftAt?: string;
}

export interface RoomParticipantsResponse {
  participants: RoomParticipant[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderUserId: string;
  text: string;
  createdAt: string;
}

export interface RoomMessagesResponse {
  messages: ChatMessage[];
}

export interface UserJoinedPayload {
  roomId: string;
  userId: string;
  at: string;
}

export interface RoomClosedPayload {
  roomId: string;
  closedAt: string;
}

export interface TypingPayload {
  roomId: string;
  userId: string;
  at: string;
}

export interface MessageNewEvent {
  type: "message.new";
  payload: ChatMessage;
}

export interface RoomUserEvent {
  type: "user.joined" | "user.reconnected" | "user.left";
  payload: UserJoinedPayload;
}

export interface TypingEvent {
  type: "typing.start" | "typing.stop";
  payload: TypingPayload;
}

export interface RoomClosedEvent {
  type: "room.closed";
  payload: RoomClosedPayload;
}

export interface WsErrorEvent {
  type: "error";
  payload: {
    message: string;
  };
}

export type ServerEvent = MessageNewEvent | RoomUserEvent | TypingEvent | RoomClosedEvent | WsErrorEvent;

export type ClientEvent =
  | {
      type: "message.send";
      payload: {
        text: string;
      };
    }
  | {
      type: "typing.start";
    }
  | {
      type: "typing.stop";
    };

export interface ToastItem {
  id: string;
  title: string;
}
