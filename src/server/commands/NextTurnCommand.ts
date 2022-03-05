import { Command } from '@colyseus/command'

import { TicTacToeRoom } from '~/server/rooms/TicTacToeRoom'

export default class NextTurnCommand extends Command<TicTacToeRoom> {
    execute() {
        this.room.state.togglePlayer()
    }
}