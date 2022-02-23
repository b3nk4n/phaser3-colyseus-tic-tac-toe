import Phaser from 'phaser';

import type RoomClient from '../services/RoomClient';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

    async create(data: { roomClient: RoomClient }) {
        console.log('game scene')

        const { roomClient } = data
        const room = await roomClient.join()

        // from previous game setup tutorial
        room.onMessage('keydown-msg', (message) => {
            console.log({message})
        })

        this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
            room.send('keydown-msg', e.key)
        })
    }
}