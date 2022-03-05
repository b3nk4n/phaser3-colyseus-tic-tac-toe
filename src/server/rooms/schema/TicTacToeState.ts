import { Schema, ArraySchema, type } from '@colyseus/schema'
import ITicTacToeState from '~/types/ITicTacToeState'
import { CellValue } from '../../../types/ITicTacToeState'

export default class TicTacToeState extends Schema implements ITicTacToeState {
    @type('number')
    activePlayer: number = 0

    @type('number')
    winningPlayer: number = -1

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
}