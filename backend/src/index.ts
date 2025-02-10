import express from "express";
import router from "./router";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // Importe o módulo http
import { Server } from "socket.io"; // Importe o Socket.io

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(router);

declare var process: { env: { PORT: number } };

const port: number = process.env.PORT || 1381;

// Crie um servidor HTTP usando o app do Express
const server = http.createServer(app);

// Configure o Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Permite todas as origens (ajuste para produção)
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"], // Prioriza WebSocket
});

// Evento de conexão do Socket.io
io.on("connection", (socket) => {
  console.log("Cliente Socket.io conectado:", socket.id);

  // Evento para receber mensagens do cliente
  socket.on("message", (data) => {
    console.log("Mensagem recebida:", data);

    // Envie a mensagem de volta para todos os clientes
    io.emit("message", data);
  });

  // Evento de desconexão
  socket.on("disconnect", () => {
    console.log("Cliente Socket.io desconectado:", socket.id);
  });
});

// Inicie o servidor
server.listen(port, () => {
  console.log(`Server aberto em ${port}`);
});

export { io };
