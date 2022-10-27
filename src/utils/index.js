import io from 'socket.io-client'
import { SERVER_URL } from '../constants'

const connection = io(SERVER_URL, {transports: ['websocket']})

connection.on('connect', (socket) => {
  console.log("Connected to IO")
})

const generateRoomId = () => {
  var result = ""
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export { connection, generateRoomId }