import mqtt from "mqtt";
import { AGVPosition } from "./types.js";
export declare function setupMQTT(onPosition: (position: AGVPosition) => void): mqtt.MqttClient;
