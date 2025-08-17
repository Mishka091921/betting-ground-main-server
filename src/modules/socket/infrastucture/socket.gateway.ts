// modules/socket/socket.gateway.ts
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { SocketSessionService } from './socket.session';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly session = new SocketSessionService();

  handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log('[Socket] No token. Disconnecting...');
      return socket.disconnect();
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret');
      const userId = payload.sub;

      if (typeof userId !== 'string') return socket.disconnect();

      socket.data.user = payload;
      socket.join('global');
      this.session.add(userId, socket);

      console.log(`[Socket] ${userId} connected and joined 'global'`);
    } catch (err) {
      console.log('[Socket] Invalid token. Disconnecting...');
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.data?.user?.sub;
    if (userId) {
      this.session.remove(userId);
      console.log(`[Socket] ${userId} disconnected`);
    }
  }

  @SubscribeMessage('chat.globalmessage')
  handleGlobalMessage(@MessageBody() msg: { content: string }, @ConnectedSocket() socket: Socket) {
    const user = socket.data.user;
    const payload = {
      sender: user.username,
      content: msg.content,
      sentAt: new Date().toISOString(),
    };

    socket.to('global').emit('chat.globalmessage', payload); 
    socket.emit('chat.globalmessage', payload);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() socket: Socket) {
    return { pong: true };
  }

  emitToUser(userId: string, event: string, data: any) {
    const socket = this.session.getSocket(userId);
    if (socket) {
      socket.emit(event, data);
    }
  }

  getOnlineUsers(): string[] {
    return this.session.getOnlineUsers();
  }

  forceLogout(userId: string) {
    this.session.disconnectUser(userId);
  }
}
