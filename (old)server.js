const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Store active rooms in memory
let rooms = {};

// Create a game room
app.post("/create-room", (req, res) => {
  const roomCode = Math.random().toString(36).substring(2, 7);
  rooms[roomCode] = { players: [], scores: {} };
  res.json({ roomCode });
});

// Join a room
app.post("/join-room", (req, res) => {
  const { roomCode, playerName } = req.body;
  if (!rooms[roomCode]) return res.status(404).json({ error: "Room not found" });
  rooms[roomCode].players.push(playerName);
  rooms[roomCode].scores[playerName] = 0;
  res.json({ success: true });
});

// WebSocket for real-time updates
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomCode, playerName }) => {
    socket.join(roomCode);
    io.to(roomCode).emit("updatePlayers", rooms[roomCode].players);
  });

  socket.on("answerQuestion", ({ roomCode, playerName, correct }) => {
    if (correct) rooms[roomCode].scores[playerName]++;
    io.to(roomCode).emit("updateScores", rooms[roomCode].scores);
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

