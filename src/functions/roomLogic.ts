import { Server, Socket } from 'socket.io';
import { GlobalState, ConnectedUsers } from '../types/types';
import { updateUserList } from './updateUserList';


export const handleJoinRoom = (io: Server, socket: Socket, room: string, globalState: GlobalState, connectedUsers: ConnectedUsers) => {

  const user = connectedUsers[socket.id];
  if (!globalState[room])
    globalState[room] = { "owner": socket.id, "playersReady": 0, "gameStatus": "start", "currentTurn": '', "players": [] };



  if (globalState[room].players.length == 4) {
    socket.emit("roomFull", "This Room is full. Please create a new one.");
    return;
  }

  globalState[room].players.push(socket.id);
  connectedUsers[socket.id].room = room;
  socket.join(room);
  io.to(room).emit('log', `User ${user.name} joined room.`);

  io.to(room).emit('ownerChange', globalState[room].owner);



  updateUserList(io, socket, globalState, connectedUsers);
};


// * This logic is not required

// export const handleLeaveRoom = (io: Server, socket: Socket, room: string, globalState: GlobalState, connectedUsers: ConnectedUsers) => {
//   socket.leave(room);
//   const user = connectedUsers[socket.id];

//   if (globalState[room].players.length == 0)
//     delete globalState[room];

//   io.to(room).emit('log', `User ${user.name} left room.`);


//   let userNameList: string[] = [];
//   globalState[user.room].players = globalState[user.room].players.filter((s) => s !== socket.id);

//   if (globalState[user.room]?.owner === socket.id) {
//     globalState[user.room].owner = globalState[user.room]?.players[0];
//     io.to(user.room).emit('ownerChange', globalState[user.room].owner);
//     io.to(user.room).emit('log', `Room Owner is ${user.name}`);
//   }

//   io.to(room).emit('userListChange', JSON.stringify(userNameList));
// };
