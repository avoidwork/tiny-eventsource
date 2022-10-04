export function eventsource(...args: any[]): EventSource;
declare class EventSource extends EventEmitter {
    constructor(config: any, ...args: any[]);
    heartbeat: {
        event: any;
        ms: any;
        msg: any;
    };
    initial: any[];
    init(req: any, res: any): EventSource;
    send(data: any, event: any, id: any): EventSource;
}
import { EventEmitter } from "events";
export {};
