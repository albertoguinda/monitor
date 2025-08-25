export interface Point {
    x: number;
    y: number;
}
export interface AGVPosition {
    agvId: number;
    x: number;
    y: number;
    battery: number;
    target?: Point;
}
export interface AGVCommand {
    agvId: number;
    target: Point;
}
