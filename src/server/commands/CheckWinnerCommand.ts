import { Command } from '@colyseus/command'

import { TicTacToeRoom } from '~/server/rooms/TicTacToeRoom'
import NextTurnCommand from '../../server/commands/NextTurnCommand'
import { CellValue } from '../../types/ITicTacToeState'

type Payload = {

}

export default class CheckWinnerCommand extends Command<TicTacToeRoom, Payload> {
    execute(payload: Payload) {
        const win = this.checkForWinner()

        if (win) {
            // TODO set winnerPlayer on state
            const activePlayer = this.room.state.activePlayer
            console.log(`Player ${ activePlayer } wins.`)
            this.room.state.winningPlayer = activePlayer
            return
        }

        return [
            new NextTurnCommand()
        ]
    }

    private checkForWinner(): boolean {
        const board = this.room.state.board
        const tilesPerDimension = Math.sqrt(board.length)

        for (let i = 0; i < tilesPerDimension; ++i) {
            // rows
            const rowStart = i * tilesPerDimension
            if (board[rowStart] !== CellValue.Empty
                && board[rowStart] === board[rowStart + 1]
                && board[rowStart] === board[rowStart + 2]) {
                return true
            }
            // cols
            if (board[i] !== CellValue.Empty
                && board[i] === board[i + tilesPerDimension]
                && board[i] === board[i + 2 * tilesPerDimension]) {
                return true
            }
        }

        // diagonals
        if (board[0] !== CellValue.Empty && board[0] === board[4] && board[0] === board[8]) return true
        if (board[2] !== CellValue.Empty && board[2] === board[4] && board[0] === board[6]) return true

        return false
    }
}