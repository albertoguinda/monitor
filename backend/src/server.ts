import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { AGVPosition, AGVCommand } from "./types.js";
import { initializeAGVs } from "./init.js";
import { moveAGV } from "./movement.js";
import { PORT, MOVE_INTERVAL, BROADCAST_INTERVAL } from "./config.js";

// Estado global de los AGVs
let agvStates = initializeAGVs();

// Servidor HTTP base
const server = http.createServer();

// Servidor WebSocket sobre el HTTP
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Cliente WebSocket conectado");

  ws.on("close", () => {
    console.log("Cliente WebSocket desconectado");
  });

  ws.on("error", (err) => {
    console.error("Error en WebSocket:", err);
  });

  // Al conectar, enviamos el estado actual completo
  Object.values(agvStates).forEach((agv) => {
    ws.send(JSON.stringify(agv));
  });

  ws.on("message", (message) => {
    try {
      const command: AGVCommand = JSON.parse(message.toString());
      console.log("Comando recibido:", command);

      // Validación de existencia de AGV
      const agv = agvStates[command.agvId];
      if (!agv) {
        console.warn(`AGV ${command.agvId} no encontrado`);
        return;
      }

      // Asignación de target
      agvStates[command.agvId] = {
        ...agv,
        target: command.target,
      };
    } catch (e) {
      console.error("Error parseando mensaje:", e);
    }
  });
});

// Función de broadcast individual
function broadcastPosition(position: AGVPosition) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(position));
    }
  });
}

// Intervalo de movimiento (bucle de simulación)
setInterval(() => {
  Object.values(agvStates).forEach((agv) => {
    if (moveAGV(agv)) {
      broadcastPosition(agv);
    }
  });
}, MOVE_INTERVAL);

// Intervalo de refresco completo (para asegurar sincronización)
setInterval(() => {
  Object.values(agvStates).forEach(broadcastPosition);
}, BROADCAST_INTERVAL);

// Arranque del servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

// Manejo de apagado limpio
process.on("SIGINT", () => {
  console.log("Apagando servidor...");
  server.close();
  wss.close();
  process.exit();
});
