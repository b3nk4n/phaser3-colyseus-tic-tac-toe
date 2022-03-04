import { Client, Room } from 'colyseus.js'
import Phaser from 'phaser'

import ITicTacToeState, { CellValue } from '~/types/ITicTacToeState';
import { Message } from '../../types/messages'

export default class RoomClient {
    private readonly client: Client
    private readonly events: Phaser.Events.EventEmitter
    private room?: Room<ITicTacToeState>

    constructor() {
        this.client = new Client('ws://localhost:3000')
        console.log({client: this.client})
        this.events = new Phaser.Events.EventEmitter()
    }

    async join() : Promise<Room> {
        this.room = await this.client.joinOrCreate('tic-tac-toe')
        this.room.onStateChange.once(state => {
            console.log({initialState: state})
            this.events.emit('state-initialized', state)
        })

        this.room.state.board.onChange = (cell, idx) => {
            this.events.emit('board-changed', cell, idx)
        }

        return this.room
    }

    makeSelection(cellIndex: number) {
        if (!this.room) {
            return
        }

        this.room.send(Message.PlayerSelection, { cellIndex })
    }

    onStateInitialized(callback: (state: ITicTacToeState) => void, context?: any) {
        this.events.once('state-initialized', callback, context)
    }

    onBoardChanged(callback: (cell: CellValue, idx: number) => void, context?: any) {
        this.events.on('board-changed', callback, context)
    }
}