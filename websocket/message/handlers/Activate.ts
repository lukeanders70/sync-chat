import { ClientConnection } from "../../clientConnection";
import { ActivateMessage, ValidateActivateMessage } from "../types/Activate";


export function HandleActivate(connection : ClientConnection, message: string) {
    console.log("incomine Activate Message")
    let activateParsed: ActivateMessage = JSON.parse(message);
    let valid = ValidateActivateMessage(activateParsed)

    if(valid) {
        if(activateParsed.connectionId == connection.connectionId) {
            connection.SetActive(activateParsed.clientName)
        } else {
            console.error("tried to activate connection with id: " + connection.connectionId + " but message was sent with id: " + activateParsed.connectionId)
        }
    } else {
        console.error("activate message was not valid: " + message)
    }
}