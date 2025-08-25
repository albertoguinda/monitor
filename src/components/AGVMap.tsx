import React, { useEffect, useRef } from "react";
import type { AGVPosition } from "../types";

// Props que recibe el componente de mapa
interface Props {
  agvs: Record<number, AGVPosition>;  // Estado de los AGVs
  mapSize: number;                   // Tamaño (ancho y alto) en píxeles
}

export default function AGVMap({ agvs, mapSize }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajuste para pantallas retina (mayor densidad de píxeles)
    const ratio = window.devicePixelRatio || 1;
    canvas.width = mapSize * ratio;
    canvas.height = mapSize * ratio;
    canvas.style.width = `${mapSize}px`;
    canvas.style.height = `${mapSize}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    // Limpieza completa del canvas antes de pintar
    ctx.clearRect(0, 0, mapSize, mapSize);

    // Dibujo de la cuadrícula de fondo (cada 20px)
    const gridStep = 20;
    ctx.strokeStyle = "#ffffff20";  // líneas muy transparentes
    ctx.lineWidth = 1;
    for (let x = 0; x <= mapSize; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mapSize);
      ctx.stroke();
    }
    for (let y = 0; y <= mapSize; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mapSize, y);
      ctx.stroke();
    }

    // Pintado de cada AGV sobre el mapa
    Object.values(agvs).forEach((agv) => {
      const { x, y, target, agvId } = agv;

      // Conversión de coordenadas lógicas (0-200) a coordenadas canvas
      const px = (x / 200) * mapSize;
      const py = (y / 200) * mapSize;

      // Dibujo del AGV como círculo azul
      ctx.fillStyle = "#3b82f6";  // Tailwind blue-500
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();

      // Escribir el ID del AGV dentro del círculo
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(agvId), px, py);

      // Si tiene destino asignado, se dibuja también
      if (target) {
        const tx = (target.x / 200) * mapSize;
        const ty = (target.y / 200) * mapSize;

        // Línea de unión actual → destino
        ctx.strokeStyle = "#f97316";  // Tailwind orange-500
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // Cuadrado rojo en el destino
        const sq = 8;
        ctx.fillStyle = "#ef4444";  // Tailwind red-500
        ctx.fillRect(tx - sq / 2, ty - sq / 2, sq, sq);
      }
    });
  }, [agvs, mapSize]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg border border-white/20 bg-white/10 shadow-inner"
    />
  );
}
