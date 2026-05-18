export interface HeartbeatArg {
    heartbeat: {
        event: string;
        ms: number;
    };
    listenerCount(event: string): number;
    send(data: string, event: string): void;
}

export function heartbeat(arg?: HeartbeatArg): void;
