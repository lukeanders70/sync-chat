import * as express from 'express';
import * as http from 'http';
import * as WebSocketServer from "./websocket/websocket"

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const connectionManager = WebSocketServer.CreateWebSocketServer(server)

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${process.env.PORT || 8999}`);
});