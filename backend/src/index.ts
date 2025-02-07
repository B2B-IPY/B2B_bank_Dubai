import express from "express";
import router from "./router";
import WebSocket from "ws";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(router);

const server = http.createServer(app);

// Configuração do WebSocket
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
   console.log("Cliente WebSocket conectado");

   // Quando uma mensagem é recebida de um cliente
   ws.on("message", (message) => {
      console.log("Mensagem recebida:", message);
   });

   // Quando o cliente se desconectar
   ws.on("close", () => {
      console.log("Cliente WebSocket desconectado");
   });
});

declare var process: { env: { PORT: number } };

const port: number = process.env.PORT || 1381;

server.listen(port, () => {
   console.log(`Server rodando na porta ${port}`);
});
