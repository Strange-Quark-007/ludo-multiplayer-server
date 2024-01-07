import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { handleConnect, handleDisconnect } from './functions/connectionLogic';
import { handleNameChange } from './functions/nameChange';
import { handleJoinRoom } from './functions/roomLogic';
import { GlobalState, ConnectedUsers } from './types/types';
import { gameLogic } from './functions/gameLogic';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
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

// * For testing 

app.get('/all', (req, res) => {
  res.send(JSON.stringify([{ ...globalState }, { ...connectedUsers }]));
});

app.get('/state', (req, res) => {
  res.send(JSON.stringify(globalState));
});

app.get('/users', (req, res) => {
  res.send(JSON.stringify(connectedUsers));
});

app.get('/rooms', (req, res) => {
  res.send(JSON.stringify(globalState.rooms));
});



io.on('connection', (socket) => {

  handleConnect(io, socket, connectedUsers);

  socket.on('nameChange', (name: string) =>
    handleNameChange(io, socket, globalState, connectedUsers, name));

  socket.on('joinRoom', (room: string) =>
    handleJoinRoom(io, socket, room, globalState, connectedUsers));


  gameLogic(io, socket, globalState, connectedUsers);


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