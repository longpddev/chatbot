import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_CHAT_SOCKET_URL);

socket.on("connect", () => {
  // eslint-disable-next-line no-console
  console.log('websocket connect to server', socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  // eslint-disable-next-line no-console
  console.log(socket.id); // undefined
});

// socket.emit('client:message:send')
// socket.on('server:message:received', () => {})
// socket.on('server:message:response', () => {})
export default socket