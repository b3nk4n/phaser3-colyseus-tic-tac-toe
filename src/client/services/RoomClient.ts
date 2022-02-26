import { Client, Room } from 'colyseus.js'
import Phaser from 'phaser';

import ITicTacToeState from "~/types/ITicTacToeState";

export default class RoomClient {
    private readonly client: Client
    private readonly events: Phaser.Events.EventEmitter

    constructor() {
        this.client = new Client('ws://localhost:3000')
        console.log({client: this.client})
        this.events = new Phaser.Events.EventEmitter()
    }

    async join() : Promise<Room> {
        const room = await this.client.joinOrCreate('tic-tac-toe')
        room.onStateChange.once(state => {
            console.log({state})
            this.events.emit('once-state-changed', state)
        })

        console.log({room})
        return room
    }

    onceStateChange(callback: (state: ITicTacToeState) => void, context?: any) {
        this.events.once('once-state-changed', callback, context)
    }
}