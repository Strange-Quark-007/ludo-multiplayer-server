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
    const random = Math.floor(Math.random() * 4);
    const playerTurn = globalState[user?.room].players[random];

    globalState[user?.room].gameStatus = "inPlay";
    globalState[user?.room].currentTurn = playerTurn;


    io.to(user?.room).emit('start', playerTurn);
    io.to(user?.room).emit('log', "And the game begins!");
    io.to(user?.room).emit('log', `Randomizing Player Turn. ${connectedUsers[playerTurn].name} goes 1st.`);
  });

  socket.on('diceRoll', () => {
    const user = connectedUsers[socket.id];
    const roll = Math.floor(Math.random() * 6) + 1;
    io.to(user?.room).emit('diceAnim');
    setTimeout(() => {
      io.to(user?.room).emit('diceRoll', roll);
    }, 1500);
  });

  socket.on('passTurn', () => {
    const user = connectedUsers[socket.id];
    const roomState = globalState[user.room];

    const activePlayers = roomState.players.filter((p) => p != "disconnected");

    let currentIndex = activePlayers.findIndex((id) => socket.id === id);
    let nextIndex = (currentIndex + 1) % activePlayers.length;
    const nextPlayerId = activePlayers[nextIndex];
    io.to(user?.room).emit('updateTurn', nextPlayerId);
  });




  socket.on('moveToken', (moveToken) => {
    const user = connectedUsers[socket.id];
    io.to(user?.room).emit('moveToken', moveToken);
  });
};