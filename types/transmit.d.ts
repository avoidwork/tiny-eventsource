type NodeHttp = import('node:http');
type IncomingMessage = NodeHttp.IncomingMessage;
type ServerResponse = NodeHttp.ServerResponse<IncomingMessage>;

export interface TransmitArg {
    data: string | Record<string, unknown>;
    event?: string;
}

export function transmit(res: ServerResponse, arg?: TransmitArg, id?: number): void;
