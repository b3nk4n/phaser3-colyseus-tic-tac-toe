import 'regenerator-runtime/runtime'
import Phaser from 'phaser'

import EmptyScene from './scenes/EmptyScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [EmptyScene]
}

export default new Phaser.Game(config)
