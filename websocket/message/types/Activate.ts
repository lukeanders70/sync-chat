import { BaseMessage } from "../types/Base"

export interface ActivateMessage extends BaseMessage{
    connectionId: string
    clientName: string
}


export function ValidateActivateMessage(message: ActivateMessage) {
    return message.connectionId != null && message.connectionId != "" && message.clientName != null && message.clientName != ""
}
