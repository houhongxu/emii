/// <reference types="node" />
import http from 'http';
declare module 'net' {
    interface Server {
        destroy(): Promise<void>;
    }
}
export default function (server: http.Server): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
