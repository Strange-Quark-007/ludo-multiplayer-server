import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { handleConnect, handleDisconnect } from './functions/connectionLogic';
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

  socket.on('disconnect', () =>
    handleDisconnect(io, socket, globalState, connectedUsers));
});


const PORT = 4000;
httpServer.listen(PORT, 'localhost', () => {
  console.log(`Server is running`);
});