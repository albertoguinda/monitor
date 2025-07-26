import { useEffect, useRef, useState, useCallback } from "react";
import AGVMap from "./AGVMap";
import AGVCard from "./AGVCard";
import type { AGVPosition } from "../types";

export default function WsClient() {
  // Estado de conexión WebSocket
  const [status, setStatus] = useState<"connecting" | "open" | "closed" | "error">("connecting");

  // Estado local de los AGVs recibidos
  const [agvs, setAgvs] = useState<Record<number, AGVPosition>>({});

  // Referencia al WebSocket
  const ws = useRef<WebSocket | null>(null);

  // Referencia al contenedor del mapa
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState(0);

  // Conexión WebSocket al backend
  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:3000`);
    ws.current = socket;

    // Estados de conexión
    socket.onopen = () => setStatus("open");
    socket.onclose = () => setStatus("closed");
    socket.onerror = () => setStatus("error");

    // Recepción de mensajes desde el backend
    socket.onmessage = ({ data }) => {
      try {
        const info = JSON.parse(data) as AGVPosition;
        setAgvs((prev) => ({ ...prev, [info.agvId]: info }));
      } catch {
        console.error("Mensaje recibido no es JSON válido:", data);
      }
    };

    // Cierre limpio del socket al desmontar el componente
    return () => socket.close();
  }, []);

  // Redimensionado automático del mapa para mantener aspecto cuadrado
  useEffect(() => {
    function updateSize() {
      if (mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        setMapSize(size > 0 ? size : 0);
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Envío de comandos de movimiento al WebSocket
  const sendCommand = useCallback((agvId: number, x: number, y: number) => {
    ws.current?.send(JSON.stringify({ agvId, target: { x, y } }));
  }, []);

  // Ordenamos los AGVs por ID para mostrar siempre ordenado
  const agvsList = Object.values(agvs).sort((a, b) => a.agvId - b.agvId).slice(0, 24);

  return (
    <div className="w-screen h-screen bg-blue-900 flex flex-col overflow-hidden">
      
      {/* Encabezado superior */}
      <header className="w-full h-16 flex flex-col justify-center items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
          Moontech - Monitor AGVs
        </h1>
        <div className="text-base font-medium text-white mt-1">
          WebSocket status:{" "}
          <span className={
            status === "open" ? "text-green-400" :
            status === "connecting" ? "text-yellow-400" :
            status === "error" ? "text-red-400" : "text-gray-400"
          }>
            {status}
          </span>
        </div>
      </header>

      {/* Contenido principal: mapa + cards */}
      <div className="flex-1 flex justify-center items-center overflow-hidden px-4 py-4">
        <div className="flex w-full max-w-[1600px] h-full gap-6">
          
          {/* Contenedor del mapa */}
          <div ref={mapContainerRef} className="flex-1 flex justify-center items-center bg-blue-900 rounded-lg p-4">
            {mapSize > 0 && <AGVMap agvs={agvs} mapSize={mapSize} />}
          </div>

          {/* Contenedor de tarjetas AGV */}
          <div className="w-[500px] flex flex-col overflow-y-auto cards-scrollbar">
            <div className="grid grid-cols-2 gap-4 pr-2">
              {agvsList.map((agv) => (
                <AGVCard key={agv.agvId} agv={agv} onSendTarget={sendCommand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
