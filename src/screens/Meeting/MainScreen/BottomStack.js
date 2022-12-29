import React, { useState } from "react"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, TouchableHighlight, View } from "react-native"

import { windowWidth } from "../../../constants"

const SingleButton = ({
  name,
  onPress,
  showBadge = false,
  isExitButton = false
}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={'transparent'}
      style={[styles.singleButton, isExitButton ? styles.exitButton : null]}
    >
      <>
        <Ionicons
          name={name}
          size={name == 'close-outline' ? 26 : 22}
          color={name == 'stop-circle-outline' ? 'red' : 'white'}
        />

        {
          showBadge && <View style={styles.notiDot}/>
        }
      </>
    </TouchableHighlight>
  )
}

const BottomStack = ({
  hangUp,
  isMuted,
  isSharing,
  toggleMute,
  openChatBox,
  shareScreen,
  stopSharing,
  switchCamera,
  showChatBadge
}) => {
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
        onPress={openChatBox}
        name={'chatbox-outline'}
        showBadge={showChatBadge}
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

export default React.memo(BottomStack)

const styles = StyleSheet.create({
  container: {
    height: '8%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
  },
  notiDot: {
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    backgroundColor: '#40bd81'
  }
})