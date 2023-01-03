import * as express from 'express';
import * as http from 'http';
import * as WebSocketServer from "./websocket/websocket"
import * as path from "path"


function setupWebSocketServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> {
    const webSocketApp = express();
    //initialize a simple http server
    const webSocketServer = http.createServer(webSocketApp);

    //initialize the WebSocket server instance
    const connectionManager = WebSocketServer.CreateWebSocketServer(webSocketServer)

    //start our server
    webSocketServer.listen(process.env.SOCKET_PORT || 8999, () => {
        console.log(`Web Socket started on port ${process.env.SOCKET_PORT || 8999}`);
    });

    return webSocketServer
}

function setupHttpServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> {
    const httpApp = express();
    const httpServer = http.createServer(httpApp)
    
    httpApp.use(express.static(path.join(__dirname, 'frontendBuild')));
    httpApp.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'frontendBuild', 'index.html'))
    });
    httpApp.listen(process.env.HTTP_PORT || 8080, () => {
        console.log(`HTTP Server started on port ${process.env.HTTP_PORT || 8080}`);
    });

    return httpServer
}

setupWebSocketServer();
setupHttpServer();
