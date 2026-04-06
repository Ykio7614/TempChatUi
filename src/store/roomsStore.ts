import { create } from "zustand";
import type { Room } from "../types/api";
import { roomsService } from "../services/roomsService";
import { clearStoredCurrentRoomId, getStoredCurrentRoomId, setStoredCurrentRoomId } from "../utils/storage";
import { registerStoreResetter } from "./storeReset";

type RoomsState = {
  rooms: Room[];
  currentRoom: Room | null;
  currentRoomId: string | null;
  isLoadingRooms: boolean;
  loadMyRooms: () => Promise<void>;
  createRoom: (maxParticipants: number) => Promise<Room>;
  joinRoom: (code: string) => Promise<Room>;
  loadRoom: (roomId: string) => Promise<Room>;
  leaveRoom: (roomId: string) => Promise<void>;
  closeRoom: (roomId: string) => Promise<void>;
  setCurrentRoom: (room: Room | null) => void;
  reset: () => void;
};

const initialState = {
  rooms: [] as Room[],
  currentRoom: null as Room | null,
  currentRoomId: getStoredCurrentRoomId(),
  isLoadingRooms: false,
};

export const useRoomsStore = create<RoomsState>((set, get) => ({
  ...initialState,
  async loadMyRooms() {
    set({ isLoadingRooms: true });
    try {
      const response = await roomsService.getMyRooms();
      set({ rooms: response.rooms });
    } finally {
      set({ isLoadingRooms: false });
    }
  },
  async createRoom(maxParticipants) {
    const room = await roomsService.createRoom(maxParticipants);
    set((state) => ({
      rooms: [room, ...state.rooms.filter((item) => item.id !== room.id)],
    }));
    get().setCurrentRoom(room);
    return room;
  },
  async joinRoom(code) {
    const response = await roomsService.joinRoom(code);
    get().setCurrentRoom(response.room);
    return response.room;
  },
  async loadRoom(roomId) {
    const room = await roomsService.getRoom(roomId);
    get().setCurrentRoom(room);
    return room;
  },
  async leaveRoom(roomId) {
    await roomsService.leaveRoom(roomId);
    get().setCurrentRoom(null);
  },
  async closeRoom(roomId) {
    await roomsService.closeRoom(roomId);
    get().setCurrentRoom(null);
  },
  setCurrentRoom(room) {
    if (room) {
      setStoredCurrentRoomId(room.id);
      set({ currentRoom: room, currentRoomId: room.id });
      return;
    }

    clearStoredCurrentRoomId();
    set({ currentRoom: null, currentRoomId: null });
  },
  reset() {
    clearStoredCurrentRoomId();
    set({
      ...initialState,
      currentRoomId: null,
    });
  },
}));

registerStoreResetter(() => {
  useRoomsStore.getState().reset();
});
