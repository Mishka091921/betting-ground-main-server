// modules/socket/socket.session.ts
import { Socket } from 'socket.io';

export class SocketSessionService {
  private sessions: Map<string, Socket> = new Map(); // userId → socket

  add(userId: string, socket: Socket) {
    this.sessions.set(userId, socket);
  }

  remove(userId: string) {
    this.sessions.delete(userId);
  }

  getSocket(userId: string): Socket | undefined {
    return this.sessions.get(userId);
  }

  isOnline(userId: string): boolean {
    return this.sessions.has(userId);
  }

  getOnlineUsers(): string[] {
    return Array.from(this.sessions.keys());
  }

  disconnectUser(userId: string) {
    const socket = this.sessions.get(userId);
    if (socket) {
      socket.disconnect(true);
      this.sessions.delete(userId);
    }
  }
}
