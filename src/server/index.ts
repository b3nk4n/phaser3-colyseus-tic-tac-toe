// Colyseus + Express
import { Server } from 'colyseus'
import { createServer } from 'http'
import cors from 'cors'
import express from 'express'
import { monitor } from '@colyseus/monitor'

import { TicTacToeRoom } from './rooms/TicTacToeRoom'

const port = Number(process.env.port) || 3000

const app = express()

app.use(cors())
app.use(express.json())

const gameServer = new Server({
    server: createServer(app)
})

gameServer.define('tic-tac-toe', TicTacToeRoom)

app.use('/colyseus', monitor())

gameServer.listen(port)
console.log(`Listening on ws://localhost:${port}`)