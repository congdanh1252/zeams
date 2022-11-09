import { Dimensions, StatusBar } from "react-native"

const SERVER_URL = `https://zeams-app.herokuapp.com/` //'http://10.10.10.190:3001'

const statusBarHeight = StatusBar.currentHeight
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export {
  statusBarHeight,
  windowHeight, 
  windowWidth,
  SERVER_URL
}