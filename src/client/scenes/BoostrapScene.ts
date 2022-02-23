import Phaser from 'phaser'

import RoomClient from '../services/RoomClient'

export default class BoostrapScene extends Phaser.Scene {
    private roomClient!: RoomClient

    constructor() {
        super('bootstrap')
    }

    init() {
        this.roomClient = new RoomClient()
    }

    create() {
        console.log('bootstrap scene')
        this.scene.launch('game', {
            roomClient: this.roomClient
        })
    }
}