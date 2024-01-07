import { Server, Socket } from 'socket.io';
import { GlobalState, ConnectedUsers } from '../types/types';
import { updateUserList } from './updateUserList';


export const handleNameChange = (io: Server, socket: Socket, globalState: GlobalState, connectedUsers: ConnectedUsers, name: string) => {
  connectedUsers[socket.id].name = name;

  updateUserList(io, socket, globalState, connectedUsers);
};
