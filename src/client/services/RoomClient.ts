import { Client, Room } from 'colyseus.js'
import Phaser from 'phaser'

import ITicTacToeState, { CellValue } from '../../types/ITicTacToeState'
import { Message } from '../../types/messages'

export default class RoomClient {
    private static readonly EVENT_STATE_INIT: string = 'state-initialized'
    private static readonly EVENT_BOARD_CHANGED: string = 'board-changed'
    private static readonly EVENT_PLAYER_TURN_CHANGED: string = 'player-turn-changed'
    private static readonly EVENT_PLAYER_WIN: string = 'player-win'

    private readonly client: Client
    private readonly events: Phaser.Events.EventEmitter
    private room?: Room<ITicTacToeState>
    private removeActivePlayerListener: Function = () => {}
    private removePlayerWinListener: Function = () => {}

    private _playerIndex: number = -1

    constructor() {
        this.client = new Client('ws://localhost:3000')
        console.log({client: this.client})
        this.events = new Phaser.Events.EventEmitter()
    }

    async join() : Promise<Room> {
        this.room = await this.client.joinOrCreate('tic-tac-toe')

        this.room.onMessage(Message.PlayerIndex, (message: { playerIdx: number }) => {
            // TODO Video 4 - 13:00
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
            console.log('WINNING-PLAYER ' + newValue)
            this.events.emit(RoomClient.EVENT_PLAYER_WIN, newValue)
        })

        return this.room
    }

    makeSelection(cellIndex: number) {
        if (!this.room) {
            return
        }

        console.log({playerIndex: this.playerIndex, activePlayer: this.room.state.activePlayer})
        if (this.playerIndex !== this.room.state.activePlayer) {
            console.warn('Not this player\'s turn!')
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

    dispose(): void {
        this.removeActivePlayerListener()
        this.removePlayerWinListener()
    }

    get playerIndex(): number {
        return this._playerIndex
    }
}