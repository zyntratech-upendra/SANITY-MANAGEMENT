import { io } from 'socket.io-client';

// Flexible WebSocket / Polling URL resolution for local dev & Render production
const getWsUrl = () => {
  const envUrl =
    import.meta.env.VITE_WS_URL ||
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000';

  const clean = envUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
  return clean || 'http://localhost:5000';
};

const WS_URL = getWsUrl();

export const socket = io(WS_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 15,
  reconnectionDelay: 2000,
  transports: ['websocket', 'polling'], // Fallback polling if WebSocket blocked on cloud host
});

socket.on('connect', () => {
  console.log(`[Socket.IO] Connected to ${WS_URL} with ID: ${socket.id}`);
});

socket.on('connect_error', (error) => {
  console.warn(`[Socket.IO] Connection notice (will retry):`, error.message);
});

socket.on('disconnect', (reason) => {
  console.log(`[Socket.IO] Disconnected:`, reason);
});
