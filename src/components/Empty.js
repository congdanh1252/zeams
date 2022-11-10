import React from "react"
import { StyleSheet, View, Text } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

import { windowHeight } from "../constants"

export const Empty = React.memo(({ message, upSideDown = false }) => {
  return (
    <View style={[styles.container, {
      transform: [
        {rotate: upSideDown ? '180deg' : '0deg'},
        {rotateY: upSideDown ? '180deg' : '0deg'}
      ]
    }]}>
      <Ionicons name="apps" size={42} color={'black'}/>

      <Text style={styles.text}>{message}</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: (windowHeight - 140) / 2,
  },
  text: {
    marginTop: 12,
    color: 'black',
  }
})