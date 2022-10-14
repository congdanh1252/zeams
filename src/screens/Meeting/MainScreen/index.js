import React from "react"
import { StyleSheet, View } from "react-native"

import COLOR from "../../../theme"
import BottomStack from "./BottomStack"
import MainSection from "./MainSection"
import { statusBarHeight } from "../../../constants"

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <MainSection />

      <BottomStack />
    </View>
  )
}

export default MainScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight,
    backgroundColor: COLOR.black
  },
})