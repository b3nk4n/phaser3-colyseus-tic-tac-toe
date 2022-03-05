import { Client, Room } from 'colyseus.js'
import Phaser from 'phaser'

import ITicTacToeState, { CellValue, GameState } from '../../types/ITicTacToeState'
import { Message } from '../../types/messages'

export default class RoomClient {
    private static readonly EVENT_STATE_INIT: string = 'state-initialized'
    private static readonly EVENT_BOARD_CHANGED: string = 'board-changed'
    private static readonly EVENT_PLAYER_TURN_CHANGED: string = 'player-turn-changed'
    private static readonly EVENT_PLAYER_WIN: string = 'player-win'
    private static readonly EVENT_GAME_STATE_CHANGED: string = 'game-state-changed'

    private readonly client: Client
    private readonly events: Phaser.Events.EventEmitter
    private room?: Room<ITicTacToeState>
    private removeActivePlayerListener: () => void = () => {}
    private removePlayerWinListener: () => void = () => {}
    private removeGameStateListener: () => void = () => {}

    private _playerIndex: number = -1

    constructor() {
        this.client = new Client('ws://localhost:3000')
        console.log({client: this.client})
        this.events = new Phaser.Events.EventEmitter()
    }

    async join() : Promise<Room> {
        this.room = await this.client.joinOrCreate('tic-tac-toe')

        this.room.onMessage(Message.PlayerIndex, (message: { playerIdx: number }) => {
            this._playerIndex = message.playerIdx
        })

        this.room.onStateChange.once(state => {
            console.log({initialState: state})
            this.events.emit(RoomClient.EVENT_STATE_INIT, state)
        })

        this.room.state.board.onChange = (cell, idx) => {
            this.events.emit(RoomClient.EVENT_BOARD_CHANGED, cell, idx)
        }

        this.removeActivePlayerListener = this.room.state.listen('activePlayer', (newValue, oldValue) => {
            this.events.emit(RoomClient.EVENT_PLAYER_TURN_CHANGED, newValue, oldValue)
        })

        this.removePlayerWinListener = this.room.state.listen('winningPlayer', (newValue, _) => {
            this.events.emit(RoomClient.EVENT_PLAYER_WIN, newValue)
        })

        this.removeGameStateListener = this.room.state.listen('gameState', (newValue, _) => {
            this.events.emit(RoomClient.EVENT_GAME_STATE_CHANGED, newValue)
        })

        return this.room
    }

    leave() {
        this.room?.leave()
        this.events.removeAllListeners()
    }

    makeSelection(cellIndex: number) {
        if (!this.room
            || this.playerIndex !== this.room.state.activePlayer
            || this.room.state.gameState !== GameState.Playing) {
            return
        }

        this.room.send(Message.PlayerSelection, { cellIndex })
    }

    onStateInitialized(callback: (state: ITicTacToeState) => void, context?: any) {
        this.events.once(RoomClient.EVENT_STATE_INIT, callback, context)
    }

    onBoardChanged(callback: (cell: CellValue, idx: number) => void, context?: any) {
        this.events.on(RoomClient.EVENT_BOARD_CHANGED, callback, context)
    }

    onPlayerTurnChanged(callback: (newPlayerIdx: number, oldPlayerIdx: number) => void, context?: any) {
        this.events.on(RoomClient.EVENT_PLAYER_TURN_CHANGED, callback, context)
    }

    onPlayerWin(callback: (playerIdx: number) => void, context?: any) {
        this.events.on(RoomClient.EVENT_PLAYER_WIN, callback, context)
    }

    onGameStateChanged(callback: (gameState: GameState) => void, context?: any) {
        this.events.on(RoomClient.EVENT_GAME_STATE_CHANGED, callback, context)
    }

    dispose(): void {
        this.removeActivePlayerListener()
        this.removePlayerWinListener()
        this.removeGameStateListener()
    }

    get playerIndex(): number {
        return this._playerIndex
    }

    get hasTurn(): boolean {
        console.log({playerIdx: this.playerIndex, activePlayer: this.room?.state.activePlayer})
        return this._playerIndex === this.room?.state.activePlayer
    }

    get gameState(): GameState {
        if (!this.room) {
            return GameState.WaitingForPlayer
        }
        return this.room.state.gameState
    }
}