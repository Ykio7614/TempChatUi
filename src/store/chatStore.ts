import { create } from "zustand";
import type { ChatMessage, RoomParticipant, UserJoinedPayload, WsStatus } from "../types/api";
import { registerStoreResetter } from "./storeReset";

type ChatState = {
  participants: RoomParticipant[];
  messages: ChatMessage[];
  typingUserIds: string[];
  wsStatus: WsStatus;
  hydrateRoom: (participants: RoomParticipant[], messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  markUserConnected: (payload: UserJoinedPayload) => void;
  markUserLeft: (payload: UserJoinedPayload) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  setWsStatus: (status: WsStatus) => void;
  reset: () => void;
};

const initialState = {
  participants: [] as RoomParticipant[],
  messages: [] as ChatMessage[],
  typingUserIds: [] as string[],
  wsStatus: "disconnected" as WsStatus,
};

export const useChatStore = create<ChatState>((set) => ({
  ...initialState,
  hydrateRoom: (participants, messages) =>
    set({
      participants,
      messages,
      typingUserIds: [],
    }),
  addMessage: (message) =>
    set((state) => {
      if (state.messages.some((item) => item.id === message.id)) {
        return state;
      }

      return {
        messages: [...state.messages, message],
      };
    }),
  markUserConnected: (payload) =>
    set((state) => {
      const existing = state.participants.find((participant) => participant.userId === payload.userId);

      if (!existing) {
        return {
          participants: [
            ...state.participants,
            {
              roomId: payload.roomId,
              userId: payload.userId,
              role: "member",
              connectionStatus: "connected",
              joinedAt: payload.at,
              lastSeenAt: payload.at,
            },
          ],
        };
      }

      return {
        participants: state.participants.map((participant) =>
          participant.userId === payload.userId
            ? {
                ...participant,
                connectionStatus: "connected",
                lastSeenAt: payload.at,
                leftAt: undefined,
              }
            : participant,
        ),
      };
    }),
  markUserLeft: (payload) =>
    set((state) => ({
      participants: state.participants.map((participant) =>
        participant.userId === payload.userId
          ? {
              ...participant,
              connectionStatus: "left",
              leftAt: payload.at,
              lastSeenAt: payload.at,
            }
          : participant,
      ),
      typingUserIds: state.typingUserIds.filter((userId) => userId !== payload.userId),
    })),
  setTyping: (userId, isTyping) =>
    set((state) => {
      const hasUser = state.typingUserIds.includes(userId);
      if (isTyping && !hasUser) {
        return { typingUserIds: [...state.typingUserIds, userId] };
      }
      if (!isTyping && hasUser) {
        return { typingUserIds: state.typingUserIds.filter((id) => id !== userId) };
      }
      return state;
    }),
  setWsStatus: (wsStatus) => set({ wsStatus }),
  reset: () => set(initialState),
}));

registerStoreResetter(() => {
  useChatStore.getState().reset();
});
