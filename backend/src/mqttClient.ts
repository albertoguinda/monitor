import mqtt from "mqtt";
import { AGVPosition } from "./types.js";
import { MQTT_BROKER } from "./config.js";

export function setupMQTT(onPosition: (position: AGVPosition) => void) {
  const client = mqtt.connect(MQTT_BROKER);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe("agv/+/position");
  });

  client.on("message", (topic, message) => {
    try {
      const position: AGVPosition = JSON.parse(message.toString());
      onPosition(position);
    } catch (err) {
      console.error("Error parsing MQTT message:", err);
    }
  });

  return client; // opcional: devolver el client por si quiero manejarlo externamente
}
