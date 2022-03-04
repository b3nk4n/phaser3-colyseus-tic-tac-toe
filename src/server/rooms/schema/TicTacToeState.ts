import { Schema, ArraySchema, type } from '@colyseus/schema'
import ITicTacToeState from '~/types/ITicTacToeState';

export default class TicTacToeState extends Schema implements ITicTacToeState {
    @type('number')
    activePlayer: number = 0;

    @type(['number'])
    board: ArraySchema<number> // works because enums are also just numbers

    constructor() {
        super();

        this.board = new ArraySchema<number>(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }
}