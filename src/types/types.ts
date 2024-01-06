export interface ConnectedUsers {
  [socketId: string]: {
    name: string;
    room: string;
  };
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