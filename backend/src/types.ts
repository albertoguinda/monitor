// Tipo reutilizable para posiciones y targets
export interface Point {
  x: number;
  y: number;
}

// Estado completo de cada AGV
export interface AGVPosition {
  agvId: number;
  x: number;
  y: number;
  battery: number;
  target?: Point;
}

// Comando recibido por WebSocket
export interface AGVCommand {
  agvId: number;
  target: Point;
}
