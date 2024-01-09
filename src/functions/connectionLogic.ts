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


  if (globalState[user.room].gameStatus !== "inPlay") {
    globalState[user.room].players = globalState[user.room].players.filter((s) => s !== socket.id);
  }
  else {
    let index = globalState[user.room].players.findIndex((p) => p === socket.id);
    globalState[user.room].players[index] = "disconnected";
  }


  updateUserList(io, socket, globalState, connectedUsers);

  delete connectedUsers[socket.id];

  if (globalState[user.room]?.players?.length == 0) {
    delete globalState[user?.room];
  }

  if (globalState[user.room]?.players?.every((p) => p === "disconnected")) {
    delete globalState[user?.room];
  }


  if (globalState[user?.room]?.owner === socket.id) {
    let newOwner = globalState[user.room]?.players.find((p) => p != "disconnected");
    globalState[user?.room].owner = newOwner!;

    io.to(user?.room).emit('ownerChange', globalState[user?.room]?.owner);

    io.to(user?.room).emit('log', `Room Owner is ${connectedUsers[globalState[user.room].owner]?.name}`);
  }
};