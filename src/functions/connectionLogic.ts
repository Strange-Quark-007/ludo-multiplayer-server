import { Server, Socket } from 'socket.io';
import { GlobalState, ConnectedUsers } from '../types/types';
import { updateUserList } from './updateUserList';


export const handleConnect = (io: Server, socket: Socket, connectedUsers: ConnectedUsers) => {
  const username = `Guest${Math.floor(Math.random() * 900) + 100}`;
  if (!connectedUsers[socket.id]) {
    connectedUsers[socket.id] = { "name": '', "room": '' };
  }
  connectedUsers[socket.id].name = username;
  socket.emit('username', username);
};


export const handleDisconnect = (io: Server, socket: Socket, globalState: GlobalState, connectedUsers: ConnectedUsers) => {

  const user = connectedUsers[socket.id];

  if (!user.room)
    return;

  io.to(user.room).emit('log', `User ${user.name} left room.`);

  globalState[user.room].players = globalState[user.room].players.filter((s) => s !== socket.id);

  if (globalState[user.room].players.length == 0) {
    delete globalState[user.room];
  }

  delete connectedUsers[socket.id];


  updateUserList(io, socket, globalState, connectedUsers);


  if (globalState[user.room]?.owner === socket.id) {
    globalState[user.room].owner = globalState[user.room]?.players[0];

    io.to(user.room).emit('ownerChange', globalState[user.room].owner);

    io.to(user.room).emit('log', `Room Owner is ${connectedUsers[globalState[user.room].owner].name}`);
  }
};