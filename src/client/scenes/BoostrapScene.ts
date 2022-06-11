import Phaser from 'phaser'

import GameOverScene from '../../client/scenes/GameOverScene'
import { IGameOverSceneData } from '../../types/scenes'
import GameScene from '../../client/scenes/GameScene'
import RoomClient from '../services/RoomClient'

export default class BoostrapScene extends Phaser.Scene {
    private static readonly KEY = 'bootstrap'

    private roomClient!: RoomClient

    constructor() {
        super(BoostrapScene.KEY)
    }

    init() {
        this.roomClient = new RoomClient()
    }

    create() {
        this.createNewGame()
    }

    private createNewGame() {
        this.scene.launch(GameScene.KEY, {
            roomClient: this.roomClient,
            onGameOver: this.onGameOver.bind(this)
        })
    }

    onGameOver(data: IGameOverSceneData) {
        this.roomClient.leave()
        this.scene.stop(GameScene.KEY)
        this.scene.launch(GameOverScene.KEY, {
            ...data,
            onRestart: this.onRestart
        })
    }

    private onRestart = () => {
        this.scene.stop(GameOverScene.KEY)
        this.createNewGame()
    }
}