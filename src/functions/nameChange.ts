import { Server, Socket } from 'socket.io';
import { GlobalState, ConnectedUsers } from '../types/types';


export const handleNameChange = (io: Server, socket: Socket, globalState: GlobalState, connectedUsers: ConnectedUsers, name: string) => {
  connectedUsers[socket.id].name = name;
  let room = connectedUsers[socket.id].room;


  let userNameList: string[] = [];
  globalState[room].players.map((socketId) => {
    userNameList.push(connectedUsers[socketId].name);
  });
  io.to(room).emit('userListChange', JSON.stringify(userNameList));
};
