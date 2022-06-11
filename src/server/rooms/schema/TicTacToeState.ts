import { CellValue, GameState } from '../../../types/ITicTacToeState'
import { ArraySchema, Schema, type } from '@colyseus/schema'
import ITicTacToeState from '~/types/ITicTacToeState'

export default class TicTacToeState extends Schema implements ITicTacToeState {
    @type('number')
    activePlayer: number = 0

    @type('number')
    winningPlayer: number = -1

    @type('number')
    gameState: GameState = GameState.WaitingForPlayer

    @type(['number'])
    board: ArraySchema<number>

    constructor() {
        super()

        this.board = new ArraySchema<number>(
            CellValue.Empty, CellValue.Empty, CellValue.Empty,
            CellValue.Empty, CellValue.Empty, CellValue.Empty,
            CellValue.Empty, CellValue.Empty, CellValue.Empty
        )
    }

    public checkForWinner(): boolean {
        const board = this.board
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

    public togglePlayer(): void {
        this.activePlayer = this.activePlayer === CellValue.X ? CellValue.O : CellValue.X
    }

    public activePlayerWins(): void {
        this.winningPlayer = this.activePlayer
    }
}