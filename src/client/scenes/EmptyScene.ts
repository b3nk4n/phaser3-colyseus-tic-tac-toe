import Phaser from 'phaser'
import * as Colyseus from 'colyseus.js';

export default class EmptyScene extends Phaser.Scene
{
    private client : Colyseus.Client;

	constructor() {
		super('empty')
        this.client = new Colyseus.Client('ws://localhost:3000');
	}

    init() {

    }

	preload() {

    }

    async create() {
        const room = await this.client.joinOrCreate('my-room');

        console.log({room});

        room.onMessage('keydown-msg', (message) => {
            console.log({message})
        })

        this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
            room.send('keydown-msg', e.key)
        })
    }
}
