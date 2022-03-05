import { Command } from '@colyseus/command'

import { TicTacToeRoom } from '~/server/rooms/TicTacToeRoom'

export default class NextTurnCommand extends Command<TicTacToeRoom> {
    execute() {
        const activePlayer = this.room.state.activePlayer
        this.room.state.activePlayer = activePlayer === 0 ? 1 : 0
    }
}