import { AGV_COUNT, MAP_SIZE } from "./config.js";
export function initializeAGVs() {
    const agvStates = {};
    for (let agvId = 1; agvId <= AGV_COUNT; agvId++) {
        agvStates[agvId] = {
            agvId,
            x: Math.floor(Math.random() * MAP_SIZE),
            y: Math.floor(Math.random() * MAP_SIZE),
            battery: Math.floor(Math.random() * 81) + 20, // 20% - 100%
        };
    }
    return agvStates;
}
//# sourceMappingURL=init.js.map