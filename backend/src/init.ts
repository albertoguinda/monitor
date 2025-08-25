import { AGVPosition } from "./types.js";
import { AGV_COUNT, MAP_SIZE } from "./config.js";

export function initializeAGVs(): Record<number, AGVPosition> {
  const agvStates: Record<number, AGVPosition> = {};

  for (let agvId = 1; agvId <= AGV_COUNT; agvId++) {
    agvStates[agvId] = {
      agvId,
      x: Math.floor(Math.random() * MAP_SIZE),
      y: Math.floor(Math.random() * MAP_SIZE),
      battery: Math.floor(Math.random() * 81) + 20,  // 20% - 100%
    };
  }

  return agvStates;
}
