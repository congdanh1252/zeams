import io from 'socket.io-client'
import { SERVER_URL } from '../constants'

const connection = io(SERVER_URL, {transports: ['websocket']})

export { connection }