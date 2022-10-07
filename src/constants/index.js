import { Dimensions, StatusBar } from "react-native"

const statusBarHeight = StatusBar.currentHeight
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export {
  statusBarHeight,
  windowHeight, 
  windowWidth
}