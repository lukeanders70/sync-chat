import { ClientConnection } from "../../clientConnection";
import { ActivateMessage, CreateActiveResponseMessage, ValidateActivateMessage } from "../types/Activate";
import { CreateNewClientMessage } from "../types/NewClient";


export function HandleActivate(connection : ClientConnection, message: string) {
    console.log("incomine Activate Message")
    let activateParsed: ActivateMessage = JSON.parse(message);
    let valid = ValidateActivateMessage(activateParsed)

    if(valid) {
        if(activateParsed.connectionId == connection.connectionId) {
            const success = connection.SetActive(activateParsed.clientName)

            // respond on new connection to let it know that activation succeeded
            const activeResponseMessage = CreateActiveResponseMessage(connection.connectionId, connection.clientName, success)
            connection.SendMessage(activeResponseMessage)

            // tell all the other client connections that we have a new client connected
            const newClientMessage = CreateNewClientMessage(connection.clientName)
            connection.SendMessageToAllOtherClients(newClientMessage)
        } else {
            console.error("tried to activate connection with id: " + connection.connectionId + " but message was sent with id: " + activateParsed.connectionId)
        }
    } else {
        console.error("activate message was not valid: " + message)
    }
}