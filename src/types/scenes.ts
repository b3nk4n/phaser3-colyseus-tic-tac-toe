import type RoomClient from '../client/services/RoomClient'

export interface IGameOverSceneData {
    winner: boolean,
    onRestart?: () => void
}

export interface IGameSceneData {
    roomClient: RoomClient,
    onGameOver: (data: IGameOverSceneData) => void
}