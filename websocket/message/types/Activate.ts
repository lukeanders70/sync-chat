import { BaseMessage } from "../types/Base"

export interface ActivateMessage extends BaseMessage{
    connectionID: string
    clientName: string
}


export function ValidateActivateMessage(message: ActivateMessage) {
    return message.connectionID != null && message.connectionID != "" && message.clientName != null && message.clientName != ""
}
