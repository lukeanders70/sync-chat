import { BaseMessage } from "../types/Base"

export interface OpenMessage extends BaseMessage{
    // letter
    open: boolean
}

export function CreateOpenMessage() : OpenMessage {
    let message : OpenMessage = {
        type: "",
        open: true,
    }
    return message
}
