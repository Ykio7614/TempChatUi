import type {
  ChatMessage,
  JoinRoomResponse,
  Room,
  RoomMessagesResponse,
  RoomParticipant,
  RoomParticipantsResponse,
  RoomsResponse,
} from "../types/api";
import { apiClient } from "./apiClient";

export const roomsService = {
  createRoom(maxParticipants: number) {
    return apiClient.request<Room>("/api/rooms", {
      method: "POST",
      body: JSON.stringify({ maxParticipants }),
    });
  },

  getMyRooms() {
    return apiClient.request<RoomsResponse>("/api/rooms/mine");
  },

  joinRoom(code: string) {
    return apiClient.request<JoinRoomResponse>("/api/rooms/join", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  getRoom(roomId: string) {
    return apiClient.request<Room>(`/api/rooms/${roomId}`);
  },

  async getParticipants(roomId: string) {
    const response = await apiClient.request<RoomParticipantsResponse>(`/api/rooms/${roomId}/participants`);
    return response.participants;
  },

  async getMessages(roomId: string) {
    const response = await apiClient.request<RoomMessagesResponse>(`/api/rooms/${roomId}/messages`);
    return response.messages;
  },

  leaveRoom(roomId: string) {
    return apiClient.request<Room>(`/api/rooms/${roomId}/leave`, {
      method: "POST",
    });
  },

  closeRoom(roomId: string) {
    return apiClient.request<Room>(`/api/rooms/${roomId}/close`, {
      method: "POST",
    });
  },

  loadRoomSnapshot(roomId: string): Promise<[RoomParticipant[], ChatMessage[]]> {
    return Promise.all([this.getParticipants(roomId), this.getMessages(roomId)]);
  },
};
