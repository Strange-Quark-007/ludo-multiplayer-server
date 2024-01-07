import { Server, Socket } from 'socket.io';
import { GlobalState, ConnectedUsers } from '../types/types';


export const gameLogic = (io: Server, socket: Socket, globalState: GlobalState, connectedUsers: ConnectedUsers) => {


  socket.on('ready', () => {
    const user = connectedUsers[socket.id];
    globalState[user?.room].playersReady = globalState[user?.room].playersReady + 1;
    let pr = globalState[user?.room].playersReady;
    io.to(user.room).emit('ready', pr);
    io.to(user.room).emit('log', `${pr} players ready.`);
  });

  socket.on('start', () => {
    const user = connectedUsers[socket.id];
    const random = Math.floor(Math.random() * 4) + 1;
    const playerTurn = globalState[user?.room].players[random];
    io.to(user?.room).emit('start', playerTurn);
    io.to(user?.room).emit('log', "And the game begins!");
    io.to(user?.room).emit('log', "Randomizing Player Turn.");
  });



};