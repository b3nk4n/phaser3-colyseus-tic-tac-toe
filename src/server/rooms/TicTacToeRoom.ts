import { Client, Room } from 'colyseus'
import { Dispatcher } from '@colyseus/command'

import TicTacToeState from './schema/TicTacToeState'
import { Message } from '../../types/messages'
import PlayerSelectionCommand from '../commands/PlayerSelectionCommand'

export class TicTacToeRoom extends Room<TicTacToeState> {
    private dispatcher = new Dispatcher(this);

    onCreate() {
        console.log('room created')
        this.setState(new TicTacToeState())

        this.onMessage(Message.PlayerSelection, (client: Client, message: { cellIndex: number }) => {
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client,
                cellIndex: message.cellIndex
            })

            // this.broadcast('keydown-msg', message, {
            //     except: client // except the sending client itself
            // })
        });
    }

    onJoin(client: Client, options: any, auth: any) {
        console.log(client.sessionId, "joined!");

        if (this.clients.length >= 2) {
            this.lock()
        }
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
        this.dispatcher.stop()
    }
}