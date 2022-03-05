import Phaser from 'phaser'

import { IGameOverSceneData } from '../../types/scenes'

export default class GameOverScene extends Phaser.Scene {
    public static readonly KEY = 'game-over'

    constructor() {
        super(GameOverScene.KEY)
    }

    create(data: IGameOverSceneData) {
        const text = data.winner
            ? 'Congratulations!'
            : 'Game over!'
        const { width, height } = this.scale

        const title = this.add.text(width / 2, height / 2, text, {
            fontSize: '46px'
        })
            .setOrigin(0.5)

        this.add.text(title.x, title.y + 100, 'Press SPACE to restart...')
            .setOrigin(0.5)

        this.input.keyboard.once('keyup-SPACE', () => {
            if (data.onRestart) {
                data.onRestart()
            }
        })
    }
}