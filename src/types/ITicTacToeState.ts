import { Schema, ArraySchema } from "@colyseus/schema"

export enum CellValue {
    Empty = -1,
    X,
    O
}

export enum GameState {
    WaitingForPlayer,
    Playing,
    GameOver
}

export interface ITicTacToeState extends Schema {
    activePlayer: number
    winningPlayer: number
    gameState: GameState
    board: ArraySchema<CellValue>
}

export default ITicTacToeState