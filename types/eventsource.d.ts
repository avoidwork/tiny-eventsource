export interface EventSourceConfig {
    event?: string;
    ms?: number;
    msg?: string;
}

type EventSourceArg = string | EventSourceConfig;

export function eventsource(...args: EventSourceArg[]): EventSource;
export declare class EventSource {
    constructor(config?: EventSourceConfig | string, ...args: EventSourceArg[]);
    heartbeat: {
        event: string;
        ms: number;
        msg: string;
    };
    initial: EventSourceArg[];
    init(req: import('node:http').IncomingMessage | undefined, res: import('node:http').ServerResponse<import('node:http').IncomingMessage> | undefined): this;
    listenerCount(event: string): number;
    emit(event: string, arg?: unknown): boolean;
    send(data: unknown, event?: string, id?: number): this;
    setMaxListeners(n: number): this;
}
