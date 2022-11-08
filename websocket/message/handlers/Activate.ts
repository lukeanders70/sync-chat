import { ClientConnection } from "../../clientConnection";
import { ActivateMessage, ValidateActivateMessage } from "../types/Activate";


export function HandleActivate(connection : ClientConnection, message: string) {
    console.log("incomine Activate Message")
    let activateParsed: ActivateMessage = JSON.parse(message);
    let valid = ValidateActivateMessage(activateParsed)

    if(valid) {
        if(activateParsed.connectionID = connection.connectionId) {
            connection.SetActive(activateParsed.clientName)
        }
    } else {
        console.log("text update message was not valid: " + message)
    }
}