import * as http from 'http';
import * as WebSocket from 'ws';
import { ClientConnectionManager } from './clientConnection';

export function CreateWebSocketServer(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) : ClientConnectionManager {
    //initialize the WebSocket server instance
    let clientConnectionManager  = new ClientConnectionManager(new WebSocket.Server({ server }));

    return clientConnectionManager
}