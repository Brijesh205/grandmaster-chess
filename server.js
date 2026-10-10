// Grandmaster Chess - Real-Time Node.js Server
// Provides static web server + real-time multiplayer with Socket.IO

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Serve static frontend assets from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Active game rooms storage
// rooms[roomCode] = { id, players: { w: socketId, b: socketId }, spectators: [], initialTime, increment, timers: { w, b }, moves: [] }
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// REST Endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    activeRooms: rooms.size,
    totalConnections: io.engine.clientsCount,
    uptime: process.uptime()
  });
});

// Real-Time Socket.IO Management
io.on('connection', (socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  // Create Room
  socket.on('create_room', (data) => {
    let roomCode = generateRoomCode();
    while (rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    const initialTime = data.initialTime || 600;
    const increment = data.increment || 0;

    const room = {
      code: roomCode,
      creator: socket.id,
      players: {
        w: socket.id,
        b: null
      },
      spectators: [],
      initialTime,
      increment,
      timers: { w: initialTime, b: initialTime },
      moves: [],
      turn: 'w',
      status: 'waiting' // waiting, active, finished
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.role = 'w';

    socket.emit('room_created', {
      roomCode,
      role: 'w',
      initialTime,
      increment
    });
    console.log(`[Room Created] Code: ${roomCode} by ${socket.id}`);
  });

  // Join Existing Room
  socket.on('join_room', (data) => {
    const code = (data.roomCode || '').toUpperCase().trim();
    const room = rooms.get(code);

    if (!room) {
      socket.emit('error_msg', 'Room not found. Check the code and try again.');
      return;
    }

    socket.join(code);
    socket.roomCode = code;

    if (!room.players.b) {
      // Assign Black player
      room.players.b = socket.id;
      room.status = 'active';
      socket.role = 'b';

      socket.emit('room_joined', {
        roomCode: code,
        role: 'b',
        initialTime: room.initialTime,
        increment: room.increment
      });

      // Broadcast game start to both players
      io.to(code).emit('game_start', {
        roomCode: code,
        whitePlayer: room.players.w,
        blackPlayer: room.players.b,
        initialTime: room.initialTime,
        increment: room.increment
      });
      console.log(`[Game Started] Room: ${code} - White: ${room.players.w}, Black: ${socket.id}`);
    } else {
      // Room already has 2 players, join as spectator
      room.spectators.push(socket.id);
      socket.role = 'spectator';

      socket.emit('room_joined', {
        roomCode: code,
        role: 'spectator',
        initialTime: room.initialTime,
        increment: room.increment,
        moves: room.moves,
        timers: room.timers
      });
      console.log(`[Spectator Joined] Room: ${code}, Socket: ${socket.id}`);
    }
  });

  // Relay Moves
  socket.on('make_move', (data) => {
    const room = rooms.get(data.roomCode);
    if (!room) return;

    // Verify it's the correct player's turn
    const isWhite = room.players.w === socket.id;
    const isBlack = room.players.b === socket.id;
    if (!isWhite && !isBlack) return; // Spectator cannot move

    if ((room.turn === 'w' && !isWhite) || (room.turn === 'b' && !isBlack)) {
      return;
    }

    // Update timers & history
    if (data.timers) {
      room.timers = data.timers;
    }
    room.moves.push(data.move);
    room.turn = room.turn === 'w' ? 'b' : 'w';

    // Broadcast move to all others in the room
    socket.to(data.roomCode).emit('opponent_move', {
      move: data.move,
      timers: room.timers
    });
  });

  // Relay Chat Messages
  socket.on('chat_message', (data) => {
    const room = rooms.get(data.roomCode);
    if (!room) return;

    let sender = 'Spectator';
    if (room.players.w === socket.id) sender = 'White';
    else if (room.players.b === socket.id) sender = 'Black';

    socket.to(data.roomCode).emit('chat_broadcast', {
      sender,
      text: data.text,
      isSelf: false
    });
  });

  // Handle Disconnection
  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected] ID: ${socket.id}`);
    if (socket.roomCode) {
      const room = rooms.get(socket.roomCode);
      if (room) {
        socket.to(socket.roomCode).emit('player_disconnected', {
          socketId: socket.id,
          role: socket.role
        });

        // Clean up empty room if both players left
        if (room.players.w === socket.id) room.players.w = null;
        if (room.players.b === socket.id) room.players.b = null;

        if (!room.players.w && !room.players.b) {
          rooms.delete(socket.roomCode);
          console.log(`[Room Cleaned] Code: ${socket.roomCode}`);
        }
      }
    }
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Grandmaster Chess server is running!`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
