import { Command } from '@colyseus/command'

import { TicTacToeRoom } from '~/server/rooms/TicTacToeRoom'
import NextTurnCommand from '../../server/commands/NextTurnCommand'

export default class CheckWinnerCommand extends Command<TicTacToeRoom> {
    execute() {
        const win = this.state.checkForWinner()

        if (win) {
            this.room.state.activePlayerWins()
            return
        }

        return [
            new NextTurnCommand()
        ]
    }
}