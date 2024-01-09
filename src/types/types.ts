export interface User {
  name: string;
  room: string;
};

export interface ConnectedUsers {
  [socketId: string]: User;
}

export interface Room {
  "owner": string;
  "gameStatus": string;
  "playersReady": number;
  "currentTurn": string;
  "players": string[];
};

export interface GlobalState {
  [roomId: string]: Room;
}