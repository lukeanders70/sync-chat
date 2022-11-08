import { ClientConnection } from "../../clientConnection";
import { AddLetterMessage, CreateNewLetterMessage, ValidateAddLetterMessage } from "../types/AddLetter";


export function HandleAddLetter(connection : ClientConnection, message: string) {
    console.log("incomine Add Letter Message")
    
    let addLetterParsed: AddLetterMessage = JSON.parse(message);
    let valid = ValidateAddLetterMessage(addLetterParsed)

    if(valid) {
        connection.SendMessageAll(CreateNewLetterMessage(connection.clientName, addLetterParsed.l))
    } else {
        console.log("text update message was not valid: " + message)
    }
}