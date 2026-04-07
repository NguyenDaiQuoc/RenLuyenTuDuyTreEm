import { io, Socket } from 'socket.io-client';

// Fix WebSocket connection issues
// Ensure correct protocol (ws vs wss) and fallback
const getSocketUrl = () => {
  if (typeof window === 'undefined') return '';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  // Use current host or environment variable
  return process.env.NEXT_PUBLIC_SOCKET_URL || `${protocol}//${host}`;
};

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      secure: window.location.protocol === 'https:',
      rejectUnauthorized: false, // For development with self-signed certs
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.warn('WebSocket disconnected:', reason);
    });
  }
  return socket;
};

export default socket;
