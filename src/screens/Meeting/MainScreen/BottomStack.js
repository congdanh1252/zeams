import React from "react"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, TouchableHighlight, View } from "react-native"

import COLOR from "../../../theme"
import { windowWidth } from "../../../constants"


const SingleButton = ({ name, onPress, isExitButton = false }) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={'transparent'}
      style={[styles.singleButton, isExitButton ? styles.exitButton : null]}
    >
      <Ionicons
        name={name}
        color={'white'}
        size={name == 'close-outline' ? 26 : 22}
      />
    </TouchableHighlight>
  )
}

const BottomStack = ({  }) => {
  const dummyFunction = () => {

  }

  return (
    <View style={styles.container}>
      <SingleButton
        name={'videocam-outline'}
        onPress={dummyFunction}
      />

      <SingleButton
        name={'mic-outline'}
        onPress={dummyFunction}
      />

      <SingleButton
        name={'chatbox-outline'}
        onPress={dummyFunction}
      />

      <SingleButton
        name={'people-outline'}
        onPress={dummyFunction}
      />

      <SingleButton
        isExitButton={true}
        name={'close-outline'}
        onPress={dummyFunction}
      />
    </View>
  )
}

export default BottomStack

const styles = StyleSheet.create({
  container: {
    height: '8%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // backgroundColor: 'blue'
  },
  singleButton: {
    paddingLeft: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.135,
    height: windowWidth * 0.135,
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
    borderRadius: (windowWidth * 0.135) / 2
  },
  exitButton: {
    backgroundColor: 'red'
  }
})