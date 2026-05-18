export interface TransmitArg {
    data: string | Record<string, unknown>;
    event?: string;
}

export function transmit(res: import('node:http').ServerResponse<import('node:http').IncomingMessage>, arg?: TransmitArg, id?: number): void;
