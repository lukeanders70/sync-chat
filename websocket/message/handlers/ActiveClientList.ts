import { ClientConnection } from "../../clientConnection";
import { ActiveClientListMessage, CreateActiveClientListResponseMessage } from "../types/ActiveClientList";


export function HandleActiveClientList(connection : ClientConnection, message: string) {
    
    const activeClientListMessage: ActiveClientListMessage = JSON.parse(message);

    const activeClientNames = connection.connectionManager.GetActiveClientNames()
    const filteredActiveClientNames = activeClientNames.filter((v: string) => {
        return v !== connection.clientName
    })
    const responseMessage = CreateActiveClientListResponseMessage(filteredActiveClientNames)
    connection.SendMessage(responseMessage)
}