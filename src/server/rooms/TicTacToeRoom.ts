import {Client, Room} from 'colyseus'

import TicTacToeState from './schema/TicTacToeState';

export class TicTacToeRoom extends Room<TicTacToeState> {
    onCreate() {
        console.log('room created')
        this.setState(new TicTacToeState())

        this.onMessage("keydown-msg", (client: Client, message) => {
            this.broadcast('keydown-msg', message, {
                except: client // except the sending client itself
            })
        });
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!");
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}