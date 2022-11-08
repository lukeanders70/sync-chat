import * as WebSocket from 'ws';
import { ClientConnection } from '../clientConnection';
import { HandleActivate } from './handlers/Activate';
import { HandleAddLetter } from './handlers/AddLetter';
import { BaseMessage, ValidateBaseMessage } from './types/Base';

export function HandleMessage(connection : ClientConnection, event: WebSocket.MessageEvent){
    let eventData = event.data.toString()
    let eventDataParsed: BaseMessage = JSON.parse(eventData);
    let valid = ValidateBaseMessage(eventDataParsed)

    if(valid) {
        switch (eventDataParsed.type) {
            case "add-letter":
                HandleAddLetter(connection, eventData)
                break;
            case "activate":
                HandleActivate(connection, eventData)
                break;
            default:
                console.log("Message of type " + eventDataParsed.type + " does not have a handler");
        }
    } else {
        console.log("failed to validate base message " + eventData)
    }
}