export interface AGVPosition {
  agvId: number;
  x: number;
  y: number;
  battery: number;
  target?: {
    x: number;
    y: number;
  };
}

export interface AGVCommand {
  agvId: number;
  target: {
    x: number;
    y: number;
  };
}
