import { Client, Room } from 'colyseus'
import { Dispatcher } from '@colyseus/command'

import PlayerSelectionCommand from '../commands/PlayerSelectionCommand'
import CheckWinnerCommand from '../commands/CheckWinnerCommand'
import { GameState } from '../../types/ITicTacToeState'
import TicTacToeState from './schema/TicTacToeState'
import { Message } from '../../types/messages'

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

    async onJoin(client: Client, options: any, auth: any) {
        console.log(client.sessionId, "joined!")

        const playerIndex = this.clients.findIndex(c => c.sessionId === client.sessionId)
        client.send(Message.PlayerIndex, { playerIndex })

        if (this.clients.length >= 2) {
            this.state.gameState = GameState.Playing
            await this.lock()
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