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
        size={name == 'close-outline' ? 26 : 22}
        color={name == 'stop-circle-outline' ? 'red' : 'white'}
      />
    </TouchableHighlight>
  )
}

const BottomStack = ({
  isMuted,
  isSharing,
  switchCamera,
  toggleMute,
  hangUp,
  shareScreen,
  stopSharing
}) => {
  const dummyFunction = () => {

  }

  return (
    <View style={styles.container}>
      <SingleButton
        onPress={switchCamera}
        name={'camera-reverse-outline'}
      />

      <SingleButton
        onPress={toggleMute}
        name={isMuted ? 'mic-off-outline' : 'mic-outline'}
      />

      <SingleButton
        name={'chatbox-outline'}
        onPress={dummyFunction}
      />

      <SingleButton
        onPress={isSharing ? stopSharing : shareScreen}
        name={isSharing ? 'stop-circle-outline' : 'share-outline'}
      />

      <SingleButton
        onPress={hangUp}
        isExitButton={true}
        name={'close-outline'}
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
    width: windowWidth * 0.138,
    height: windowWidth * 0.138,
    borderRadius: (windowWidth * 0.138) / 2,
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  exitButton: {
    backgroundColor: 'red'
  }
})