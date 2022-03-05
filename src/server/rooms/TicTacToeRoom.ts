import {Client, Room} from 'colyseus'
import {Dispatcher} from '@colyseus/command'

import TicTacToeState from './schema/TicTacToeState'
import { Message } from '../../types/messages'
import PlayerSelectionCommand from '../commands/PlayerSelectionCommand'
import CheckWinnerCommand from '../commands/CheckWinnerCommand'
import { GameState } from '../../types/ITicTacToeState'

export class TicTacToeRoom extends Room<TicTacToeState> {
    private dispatcher = new Dispatcher(this)

    onCreate() {
        this.maxClients = 2
        this.setState(new TicTacToeState())

        this.onMessage(Message.PlayerSelection, (client: Client, message: { cellIndex: number }) => {
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client,
                cellIndex: message.cellIndex
            })

            this.dispatcher.dispatch(new CheckWinnerCommand())
        })
    }

    onJoin(client: Client, options: any, auth: any) {
        console.log(client.sessionId, "joined!")

        const playerIdx = this.clients.findIndex(c => c.sessionId === client.sessionId)
        client.send(Message.PlayerIndex, { playerIdx })

        if (this.clients.length >= 2) {
            this.state.gameState = GameState.Playing
            this.lock()
        }
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!")
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...")
        this.dispatcher.stop()
    }
}