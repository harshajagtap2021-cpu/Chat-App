import { io } from 'socket.io-client';

const socket = io({
  autoConnect: true,
  reconnection: true,
});

export default socket;
