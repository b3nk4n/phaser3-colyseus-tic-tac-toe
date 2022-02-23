import { Client, Room } from 'colyseus.js'

export default class RoomClient {
    private readonly client: Client

    constructor() {
        this.client = new Client('ws://localhost:3000')
        console.log({client: this.client})
    }

    async join() : Promise<Room> {
        const room = await this.client.joinOrCreate('tic-tac-toe')
        console.log({room})
        return room
    }
}