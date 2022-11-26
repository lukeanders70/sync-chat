import {v4 as uuidv4} from 'uuid';
import * as WebSocket from 'ws';
import { HandleMessage, InActiveHandleMessage } from './message/MessageHandler';
import { BaseMessage } from './message/types/Base';
import { CreateConnectedMessage } from './message/types/Connected';
import { CreateOpenMessage } from './message/types/Open';
import { CreateRemoveClientMessage } from './message/types/RemoveClient';

export enum ConnectionStatus {
    Connected = 1,
    Active,
}

export class ClientConnection {
    public clientName: string;
    public connectionId: string;
    public status: ConnectionStatus
    public ws : WebSocket
    public connectionManager : ClientConnectionManager

    public constructor(ws : WebSocket, connectionId : string, connectionManager : ClientConnectionManager) {
        this.connectionId = connectionId
        this.clientName = ""
        this.status = ConnectionStatus.Connected
        this.ws = ws
        this.connectionManager = connectionManager

        this.SetMessageListeners()
    }
 
    public SetActive(name: string): boolean {
        this.clientName = name
        this.status = ConnectionStatus.Active
        const successfullyActivated = this.connectionManager.ActivateConnection(this)
        if(successfullyActivated) {
            this.status = ConnectionStatus.Active
        }
        return successfullyActivated
    }

    public SendMessage(message : BaseMessage, forceActive : boolean = true) {
        if(!forceActive || this.status == ConnectionStatus.Active) {
            console.log("outgoing message of type : " + message.type + " on connection of name " + this.clientName)
            this.ws.send(JSON.stringify(message))
        } else {
            console.log("tried to send a message on an inactive connection")
        }
    }

    public SendMessageAll(message : BaseMessage) {
        this.connectionManager.SendMessageAll(message)
    }

    public SendMessageToAllOtherClients(message : BaseMessage) {
        this.connectionManager.SendMessageAllExcept(message, this.connectionId)
    }

    private SetMessageListeners() {
        this.ws.onopen = this.HandleOpen.bind(this)
        this.ws.onmessage = this.HandleMessage.bind(this)
        this.ws.onerror = this.HandleError.bind(this)
        this.ws.onclose = this.HandleClose.bind(this)
    }

    private HandleOpen(event: WebSocket.Event) {
        // Send Open Message
        let openMessage = CreateOpenMessage()
        this.SendMessage(openMessage)
    }

    private HandleMessage(event: WebSocket.MessageEvent) {
        if(this.status == ConnectionStatus.Active) {
            HandleMessage(this, event)
        } else {
            InActiveHandleMessage(this, event)
        }
    }

    private HandleError(event: WebSocket.ErrorEvent) {
        console.error("Error on websocket connection id: " + this.connectionId + " user: " + this.clientName + " " + event.error)
    }

    private HandleClose(event: WebSocket.CloseEvent) {
        console.log("Connection closed for connection with id: " + this.connectionId + " and name " + this.clientName)
        this.connectionManager.RemoveConnection(this)
    }
}

export class ClientConnectionManager {

    //web socket server that underpins this connection manager
    public wss : WebSocket.Server<WebSocket.WebSocket>

    // Maps IDs to Connections
    private connections : Map<string, ClientConnection>
    // Maps Names to Connections
    private activeConnections : Map<string, ClientConnection>

    public constructor(wss : WebSocket.Server<WebSocket.WebSocket>) {
        this.wss = wss
        this.connections = new Map()
        this.activeConnections = new Map()

        this.wss.on('connection', this.AddConnection.bind(this))
    }

    public AddConnection(ws : WebSocket) : string {
        console.log("Attempting to add new connection")
        let newConnectionId = uuidv4();
        var newConnection = new ClientConnection(ws, newConnectionId, this)
        this.connections.set(newConnectionId, newConnection)

        newConnection.SendMessage(CreateConnectedMessage(newConnectionId), false) // this message is sent before connection is 'active'

        return newConnectionId
    }

    public ActivateConnection(connection : ClientConnection) : boolean {
        if (!this.connections.has(connection.connectionId)) {
            console.error("tried to activate connection, but not present in connection manager. Removing")
            this.RemoveConnection(connection)
            return false
        }
        if(this.activeConnections.has(connection.clientName)) {
            let existingActiveConnection = this.activeConnections.get(connection.clientName)
            if(existingActiveConnection == connection) {
                console.log("tried to activate connection, but already active. Ignoring")
            } else {
                console.error("tried to activate connection, but name is already in use. Disconnecting")
                this.RemoveConnection(connection)
            }
            return false
        }
        if(connection.clientName == null || connection.clientName == "" || connection.status != ConnectionStatus.Active) {
            console.error("tried to activate a connection, but was not activatable. Disconnecting")
            this.RemoveConnection(connection)
            return false
        }
        this.activeConnections.set(connection.clientName, connection)
        console.log("activated connection : " + connection.connectionId + " with name " + connection.clientName)
        return true;
    }

    public SendMessageAll(message : BaseMessage) {
        console.log("sending message of type: " + message.type + " on all active connections")
        this.activeConnections.forEach((connection: ClientConnection, key: string) => {
            connection.SendMessage(message)
        });
    }

    public SendMessageAllExcept(message : BaseMessage, connectionIdToExclude : string) {
        console.log("sending message of type: " + message.type + " on all active connections except " + connectionIdToExclude)
        this.activeConnections.forEach((connection: ClientConnection, key: string) => {
            if(connection.connectionId != connectionIdToExclude) {
                connection.SendMessage(message)
            }
        });
    }

    public GetActiveClientNames(): string[] {
        let activeClientNames : string[] = []
        this.activeConnections.forEach((connection: ClientConnection, key: string) => {
            activeClientNames.push(key)
        });
        return activeClientNames
    }

    public RemoveConnection(connection : ClientConnection) {
        let connDeleted = false
        let activeConnDeleted = false

        // try delete connection by id
        if(connection.connectionId != null && connection.connectionId != "") {
            connDeleted = this.connections.delete(connection.connectionId)
        }

        // try delete active connection by name
        if(connection.clientName != null && connection.clientName != "") {
            activeConnDeleted = this.activeConnections.delete(connection.clientName) || connection.status != ConnectionStatus.Active
        }

        // if can't delete by id, delete connection by object ref
        if(!connDeleted) {
            for(let key of this.connections.keys()) {
                if(this.connections.get(key) == connection) {
                    this.connections.delete(key)
                    connDeleted = true
                    break;
                }
            }
        }

        // id can't delete active connection by name, delete by object ref
        if(!activeConnDeleted) {
            for(let key of this.activeConnections.keys()) {
                if(this.connections.get(key) == connection) {
                    this.activeConnections.delete(key)
                    connDeleted = true
                    break;
                }
            }
        }

        if(connection.ws.readyState == WebSocket.OPEN || connection.ws.readyState == WebSocket.CONNECTING) {
            connection.ws.close()
        }

        if(!connDeleted) {
            console.log("tried and failed to delete connection name: " + connection.clientName + " id: " + connection.connectionId)
            return
        }

        if(!activeConnDeleted) {
            console.log("tried and failed to delete active connection name: " + connection.clientName + " id: " + connection.connectionId)
            return
        }

        console.log("removed connection with name: " + connection.clientName + " and id: " + connection.connectionId)

        // Send message to all other clients informting them that this client is gone now
        const removeClientMessage = CreateRemoveClientMessage(connection.clientName)
        this.SendMessageAll(removeClientMessage)
    }

}