import { BaseMessage } from "./Base"

// This defines a message sent from the server to a client informing of a new client connection
// from a different client
export interface NewClientMessage extends BaseMessage {
    clientName: string
}

export function CreateNewClientMessage(newClientName: string): NewClientMessage {
    const newClientMessage : NewClientMessage = {
        type: "new-client",
        clientName: newClientName
    }
    return newClientMessage
}
