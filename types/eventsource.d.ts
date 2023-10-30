export function eventsource(...args: any[]): EventSource;
export class EventSource {
    constructor(config: any, ...args: any[]);
    heartbeat: {
        event: any;
        ms: any;
        msg: any;
    };
    initial: any[];
    init(req: any, res: any): this;
    listenerCount(eventName: string): number;
    send(data: any, event: any, id: any): this;
    setMaxListeners(arg: number): this;
}
