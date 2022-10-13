import React from "react"
import { TouchableOpacity, StyleSheet, Text, TouchableHighlight } from "react-native"

import COLOR from "../theme"

const Button = ({
  title,
  width,
  height,
  onPress,
  hasBlackBg
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, {
        width: width,
        height: height,
        backgroundColor: hasBlackBg ? COLOR.black : COLOR.white
      }]}
    >
      <Text style={hasBlackBg ? styles.whiteText : styles.blackText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    borderWidth: 2,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLOR.black,
    backgroundColor: COLOR.black
  },
  whiteText: {
    color: COLOR.white
  },
  blackText: {
    color: COLOR.black
  }
})