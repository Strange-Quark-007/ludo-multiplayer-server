import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { handleConnect, handleDisconnect } from './functions/connectionLogic';
import { handleJoinRoom } from './functions/roomLogic';
import { GlobalState, ConnectedUsers } from './types/types';

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
});



let connectedUsers: ConnectedUsers = {};
let globalState: GlobalState = {};

app.get('/', (req, res) => {
  res.send('Hello LUDO!');
});


io.on('connection', (socket) => {

  handleConnect(io, socket, connectedUsers);


  socket.on('joinRoom', (room: string) =>
    handleJoinRoom(io, socket, room, globalState, connectedUsers));



  // * Leaving room is same as disconnect and might not need to repeat same logic. socket.on('disconnect') handles it all.
  // socket.on('leaveRoom', (room: string) =>
  //   handleLeaveRoom(io, socket, room, globalState, connectedUsers));

  socket.on('disconnect', () =>
    handleDisconnect(io, socket, globalState, connectedUsers));
});


const PORT = 4000;
httpServer.listen(PORT, 'localhost', () => {
  console.log(`Server is running`);
});