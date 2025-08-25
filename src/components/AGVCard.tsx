import type { AGVPosition } from "../types";
import { useState, useCallback } from "react";

// Props del componente: recibe un AGV individual y la función para enviar comandos
interface Props {
  agv: AGVPosition;
  onSendTarget: (agvId: number, x: number, y: number) => void;
}

export default function AGVCard({ agv, onSendTarget }: Props) {
  // Estado interno del formulario de coordenadas
  const [coords, setCoords] = useState({ x: "", y: "" });

  // Determina si la batería está baja para ajustar colores
  const batteryLow = agv.battery <= 20;

  // Actualización controlada de los inputs X/Y
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCoords((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Envío del formulario: envía el nuevo target al WebSocket
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const xNum = Number(coords.x);
      const yNum = Number(coords.y);
      if (!isNaN(xNum) && !isNaN(yNum)) {
        onSendTarget(agv.agvId, xNum, yNum);
        setCoords({ x: "", y: "" });  // Reseteo tras enviar
      }
    },
    [coords, onSendTarget, agv.agvId]
  );

  // Definimos color dinámico de la barra de batería
  const barColor = batteryLow ? "bg-red-500" : "bg-green-400";

  return (
    <div
      className="
        w-full flex flex-col p-4 
        bg-white/20 backdrop-blur-sm border border-white/30
        rounded-xl shadow transition-all duration-300 min-h-[160px]
        hover:border-blue-400 hover:bg-white/30 cursor-pointer">
      {/* Cabecera: ID, barra de batería, porcentaje */}
      <div className="w-full flex items-center mb-2">
        <div
          className="
            w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center
            text-white font-semibold text-base border-2 border-blue-400">
          {agv.agvId}
        </div>
        <div className="ml-3 flex-1">
          <div className="text-white font-semibold text-sm">AGV #{agv.agvId}</div>
          <div className="mt-1 w-full h-2 bg-white/25 rounded-full overflow-hidden">
            <div className={`h-full ${barColor}`} style={{ width: `${agv.battery}%` }} />
          </div>
          <div className={`text-xs font-semibold mt-[2px] ${batteryLow ? "text-red-300" : "text-white/70"}`}>
            {agv.battery}%
          </div>
        </div>
      </div>

      {/* Estado de posición actual y destino */}
      <div className="w-full text-left mb-2 text-sm text-white leading-tight">
        Posición:{" "}
        <span className="font-mono">{Math.round(agv.x)}, {Math.round(agv.y)}</span>
        {agv.target && (
          <div className="text-xs text-orange-300 font-mono">
            Destino: {Math.round(agv.target.x)}, {Math.round(agv.target.y)}
          </div>
        )}
      </div>

      {/* Formulario para asignar nuevo destino */}
      <form className="flex items-center justify-between gap-2" onSubmit={handleSubmit}>
        {(["x", "y"] as const).map((axis) => (
          <input
            key={axis}
            name={axis}
            type="number"
            placeholder={axis.toUpperCase()}
            className="
              w-16 h-9 px-2 text-sm font-semibold text-white bg-transparent
              border border-white/50 rounded placeholder-white/50
              focus:outline-none focus:ring focus:ring-blue-300"
            value={coords[axis]}
            onChange={handleChange}
            min={0}
            max={200}
            required
          />
        ))}
        <button
          type="submit"
          className="
            w-full px-3 py-2 text-sm font-semibold text-white
            bg-gradient-to-r from-blue-600 to-blue-400 rounded shadow
            hover:opacity-90 transition-opacity">
          Enviar
        </button>
      </form>
    </div>
  );
}
