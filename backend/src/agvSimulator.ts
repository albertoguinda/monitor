import mqtt from "mqtt";
import { MAP_SIZE } from "./config.js";

const client = mqtt.connect("mqtt://test.mosquitto.org");
const NUM_AGVS = 3;

setInterval(() => {
  for (let id = 1; id <= NUM_AGVS; id++) {
    const position = {
      agvId: id,
      x: Math.floor(Math.random() * MAP_SIZE),
      y: Math.floor(Math.random() * MAP_SIZE),
      battery: Math.floor(Math.random() * 81) + 20,  // 20% - 100%
    };
    client.publish(`agv/${id}/position`, JSON.stringify(position));
  }
}, 1000);

process.on("SIGINT", () => {
  console.log("Cerrando simulador...");
  client.end();
  process.exit();
});
