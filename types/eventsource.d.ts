export function eventsource(...args: any[]): EventSource;
export class EventSource {
    constructor(config: any, ...args: any[]);
    heartbeat: {
        event: string;
        ms: number;
        msg: string;
    };
    initial: string[];
    init(req: any, res: any): this;
    listenerCount(eventName: string): number;
    on(ev: string, fn: Function): this;
    off(ev: string, fn: Function): this;
    send(data: any, event?: any, id?: any): this;
    setMaxListeners(arg: number): this;
}
