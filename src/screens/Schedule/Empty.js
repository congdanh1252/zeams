import React from "react"
import { StyleSheet, View, Text } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

import { windowHeight } from "../../constants"

export const Empty = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="apps-outline" size={44} color={'black'}/>

      <Text style={styles.text}>You have no schedules now!</Text>
    </View>
  )
}

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