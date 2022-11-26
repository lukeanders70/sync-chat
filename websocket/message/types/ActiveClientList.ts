import { BaseMessage } from "../types/Base"

export interface ActiveClientListMessage extends BaseMessage{
    clientName: string
}

export function CreateActivateClientListMessage(clientName: string) : ActiveClientListMessage  {
    let activateClientListMessage : ActiveClientListMessage = {
        type: "active-client-list",
        clientName: clientName
    }
    return activateClientListMessage
}

export interface ActiveClientListResponseMessage extends BaseMessage {
    clientNames: string[] // list of active clients besides this one
}

export function CreateActiveClientListResponseMessage(clientNames : string[]) : ActiveClientListResponseMessage {
    const activeClientListResponseMessage : ActiveClientListResponseMessage = {
        type: "active-client-list-response",
        clientNames: clientNames
    }
    return activeClientListResponseMessage
}
