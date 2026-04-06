import type { ClientEvent, ServerEvent, WsStatus } from "../types/api";

type ServerEventListener = (event: ServerEvent) => void;
type StatusListener = (status: WsStatus) => void;

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function toWsBaseUrl(httpBaseUrl: string) {
  const url = new URL(httpBaseUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return normalizeBaseUrl(url.toString());
}

class WsClient {
  private socket: WebSocket | null = null;
  private eventListeners = new Set<ServerEventListener>();
  private statusListeners = new Set<StatusListener>();
  private activeRoomId: string | null = null;

  connect(roomId: string, accessToken: string) {
    this.disconnect();

    const wsBaseUrl = normalizeBaseUrl(import.meta.env.VITE_WS_BASE_URL ?? toWsBaseUrl(import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"));
    const url = new URL(`${wsBaseUrl}/ws/rooms/${roomId}`);
    url.searchParams.set("access_token", accessToken);

    this.activeRoomId = roomId;
    this.notifyStatus("connecting");

    const socket = new WebSocket(url.toString());
    this.socket = socket;

    socket.addEventListener("open", () => {
      this.notifyStatus("connected");
    });

    socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data) as ServerEvent;
        this.eventListeners.forEach((listener) => listener(payload));
      } catch {
        this.eventListeners.forEach((listener) =>
          listener({
            type: "error",
            payload: {
              message: "Received malformed websocket payload.",
            },
          }),
        );
      }
    });

    socket.addEventListener("close", () => {
      if (this.socket === socket) {
        this.socket = null;
        this.notifyStatus("disconnected");
      }
    });

    socket.addEventListener("error", () => {
      this.eventListeners.forEach((listener) =>
        listener({
          type: "error",
          payload: {
            message: "Realtime connection error.",
          },
        }),
      );
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.activeRoomId = null;
    this.notifyStatus("disconnected");
  }

  send(event: ClientEvent) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("Realtime connection is not ready.");
    }

    this.socket.send(JSON.stringify(event));
  }

  subscribe(listener: ServerEventListener) {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  subscribeStatus(listener: StatusListener) {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private notifyStatus(status: WsStatus) {
    this.statusListeners.forEach((listener) => listener(status));
  }
}

export const wsClient = new WsClient();
