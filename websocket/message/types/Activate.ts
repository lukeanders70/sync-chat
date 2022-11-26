import { BaseMessage } from "../types/Base"

export interface ActivateMessage extends BaseMessage {
    connectionId: string
    clientName: string
}


export function ValidateActivateMessage(message: ActivateMessage) {
    return message.connectionId != null && message.connectionId != "" && message.clientName != null && message.clientName != ""
}

export interface ActiveResponse extends BaseMessage {
    connectionId: string
    clientName: string
    success: boolean
}

export function CreateActiveResponseMessage(connectionId : string, clientName: string, success: boolean){
    let activeResponseMessage : ActiveResponse = {
        type: "activate-response",
        connectionId: connectionId,
        clientName: clientName,
        success: success,
    }
    return activeResponseMessage
}
