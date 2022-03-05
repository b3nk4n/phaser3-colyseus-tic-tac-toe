import Phaser from 'phaser'

import type RoomClient from '../services/RoomClient'
import ITicTacToeState, { GameState } from '../../types/ITicTacToeState'
import { IGameOverSceneData, IGameSceneData } from '../../types/scenes'
import { CellValue } from '../../types/ITicTacToeState'

export default class GameScene extends Phaser.Scene {
    public static readonly KEY = 'game'

    private roomClient?: RoomClient
    private onGameOver?: (data: IGameOverSceneData) => void
    private cells?: {
        display: Phaser.GameObjects.Rectangle,
        value: CellValue
    }[]
    private infoText?: Phaser.GameObjects.Text

    constructor() {
        super(GameScene.KEY)
    }

    // scenes are reused by Phaser, and init is called each time when a scene starts
    init() {
        this.cells = []
    }

    async create(data: IGameSceneData) {
        console.log('game scene')

        this.roomClient = data.roomClient
        this.onGameOver = data.onGameOver

        if (!this.roomClient) {
            throw new Error('Server connection is not available')
        }

        const room = await this.roomClient.join()

        this.roomClient.onStateInitialized(this.createBoard, this)

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

        state.board.forEach((cellValue, idx) => {
            const row = Math.floor(idx / tilesPerDimension)
            const column = idx % tilesPerDimension
            const x = startX + column * (tileSize + spacing)
            const y = startY + row * (tileSize + spacing)
            const cellRect = this.add.rectangle(x, y, tileSize, tileSize, tileColor)
                .setInteractive()
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                    this.roomClient?.makeSelection(idx)
                })

            this.renderCell(cellRect.x, cellRect.y, cellValue)
            this.cells?.push({ display: cellRect, value: cellValue})
        })

        this.infoText = this.add.text(width / 2, 32, '')
            .setOrigin(0.5)

        this.roomClient?.onBoardChanged(this.handleBoardChanged, this)
        this.roomClient?.onPlayerTurnChanged(this.handlePlayerTurnChanged, this)
        this.roomClient?.onPlayerWin(this.handlePlayerWin, this)
        this.roomClient?.onGameStateChanged(this.handleGameStateChanged, this)
    }

    private handleBoardChanged(newCellValue: CellValue, idx: number): void {
        if (!this.cells) return

        const cell = this.cells[idx]
        if (cell.value !== newCellValue) {
            this.renderCell(cell.display.x, cell.display.y, newCellValue)
            cell.value = newCellValue
        }
    }

    private renderCell(x: number, y: number, value: CellValue): void {
        if (value === CellValue.X) {
            this.add.star(x, y, 4, 4, 64, 0xff0000)
                .setAngle(45)
        } else if (value === CellValue.O) {
            this.add.circle(x, y, 50, 0x0000ff)
        }
    }

    private handlePlayerTurnChanged(): void {
        if (!this.infoText) return

        if (this.roomClient?.hasTurn) {
            this.infoText.setText('Your turn.').setVisible(true)
        } else {
            this.infoText.setText('').setVisible(false)
        }
    }

    private handlePlayerWin(playerIdx: number): void {
        this.time.delayedCall(1000, () => {
            if (!this.onGameOver) {
                return
            }

            const winner = this.roomClient?.playerIndex === playerIdx
            this.onGameOver({ winner })
        })
    }

    private handleGameStateChanged(gameState: GameState) {
        if (!this.infoText) return

        if (gameState === GameState.WaitingForPlayer) {
            this.infoText.setText('Waiting for player...').setVisible(true)
        } else if (gameState === GameState.Playing) {
            this.handlePlayerTurnChanged()
        }
    }
}