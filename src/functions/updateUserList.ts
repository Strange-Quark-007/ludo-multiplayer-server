import { Server, Socket } from 'socket.io';
import { GlobalState, ConnectedUsers } from '../types/types';

interface UserItem {
  socketId: string;
  name: string;
};

export const updateUserList = (io: Server, socket: Socket, globalState: GlobalState, connectedUsers: ConnectedUsers) => {

  const user = connectedUsers[socket.id];
  let userList: UserItem[] = [];

  globalState[user?.room]?.players?.map((socketId) => {
    userList.push({ "socketId": socketId, "name": connectedUsers[socketId].name });
  });

  io.to(user?.room).emit('userListChange', JSON.stringify(userList));
};