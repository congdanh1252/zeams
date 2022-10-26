import React from "react"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity, StyleSheet, Text, Platform } from "react-native"

import COLOR from "../theme"

const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.button}
    >
      <Ionicons name="chevron-back-outline" color={COLOR.white} size={20}/>
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
  button: {
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.black,
    top: Platform.OS == 'android' ? 40 : 12,
  },
  whiteText: {
    color: COLOR.white
  },
  blackText: {
    color: COLOR.black
  }
})