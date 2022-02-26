import Phaser from 'phaser';

import type RoomClient from '../services/RoomClient';
import ITicTacToeState from "~/types/ITicTacToeState";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

    async create(data: { roomClient: RoomClient }) {
        console.log('game scene')

        const { roomClient } = data
        const room = await roomClient.join()

        roomClient.onceStateChange(this.createBoard, this)

        // from previous game setup tutorial
        room.onMessage('keydown-msg', (message) => {
            console.log({message})
        })

        this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
            room.send('keydown-msg', e.key)
        })
    }

    private createBoard(state: ITicTacToeState) {
        const { width, height } = this.scale

        const spacing = 10
        const tileSize = 128
        const tileColor = 0xffffff
        const tilesPerDimension = Math.sqrt(state.board.length)
        const boardSize = tilesPerDimension * tileSize + (tilesPerDimension - 1) * spacing
        const startX = (width - boardSize + tileSize) / 2
        const startY = (height - boardSize + tileSize) / 2

        console.log({width, height, boardSize, startX, startY})

        state.board.forEach((cellState, idx) => {
            const row = Math.floor(idx / tilesPerDimension)
            const column = idx % tilesPerDimension
            const x = startX + column * (tileSize + spacing)
            const y = startY + row * (tileSize + spacing)
            this.add.rectangle(x, y, tileSize, tileSize, tileColor)
        })
    }
}