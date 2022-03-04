import { Command } from '@colyseus/command'
import { Client } from 'colyseus';

import { TicTacToeRoom } from '~/server/rooms/TicTacToeRoom';
import { CellValue } from '../../types/ITicTacToeState';

type Payload = {
    client: Client
    cellIndex: number
}

export default class PlayerSelectionCommand extends Command<TicTacToeRoom, Payload> {
    execute(payload: Payload) {
        const { client, cellIndex } = payload;

        const clientIndex = this.room.clients.findIndex(c => c.id === client.id)
        const oldCellValue = this.room.state.board[cellIndex];

        if (oldCellValue === CellValue.Empty) {
            const newCellValue = clientIndex === 0 ? CellValue.X : CellValue.O
            this.room.state.board[cellIndex] = newCellValue
        }
    }
}