import { AGVPosition } from "./types.js";
import { SPEED } from "./config.js";

export function moveAGV(agv: AGVPosition): boolean {
  if (!agv.target) return false;

  const dx = agv.target.x - agv.x;
  const dy = agv.target.y - agv.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < SPEED) {
    agv.x = agv.target.x;
    agv.y = agv.target.y;
    delete agv.target;
    return true;
  }

  const ratio = SPEED / distance;
  agv.x += dx * ratio;
  agv.y += dy * ratio;

  // Redondeo a 3 decimales para evitar acumulación de decimales flotantes
  agv.x = parseFloat(agv.x.toFixed(3));
  agv.y = parseFloat(agv.y.toFixed(3));

  return true;
}
