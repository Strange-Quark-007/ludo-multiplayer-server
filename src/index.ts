import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
});

app.get('/', (req, res) => {
  res.send('Hello LUDO!');
});


const PORT = 4000;
httpServer.listen(PORT, 'localhost', () => {
  console.log(`Server is running`);
});
