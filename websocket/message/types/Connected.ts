import { BaseMessage } from "../types/Base"

export interface ConnectedMessage extends BaseMessage{
    // letter
    connectionId: string
}

export function CreateConnectedMessage(connectionId : string) : ConnectedMessage {
    let message : ConnectedMessage = {
        type: "connected",
        connectionId: connectionId,
    }
    return message
}
