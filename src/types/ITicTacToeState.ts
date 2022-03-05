import { Schema, ArraySchema } from "@colyseus/schema"

export enum CellValue {
    Empty = -1,
    X,
    O
}

export interface ITicTacToeState extends Schema {
    board: ArraySchema<CellValue>

    activePlayer: number
}

export default ITicTacToeState