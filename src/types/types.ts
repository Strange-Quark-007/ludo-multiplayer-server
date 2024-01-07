export interface User {
  name: string;
  room: string;
};

export interface ConnectedUsers {
  [socketId: string]: User;
}

export interface Room {
  "owner": string;
  "playersReady": number;
  "currentTurn": string;
  "players": string[];
};

export interface GlobalState {
  [roomId: string]: Room;
}