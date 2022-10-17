import React, {useState} from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native'

import COLOR from '../../theme'

const EnterCode = ({route, navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/Logo.png')}></Image>
      </View>

      <Text style={styles.text}>
        Enter the code provided by the meeting organiser
      </Text>

      <View style={styles.input}>
        <TextInput placeholder="Enter code"></TextInput>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.blackButton]}
        onPress={() => {
          navigation.navigate('JoinMeeting')
        }}>
        <Text style={styles.whiteText}>Join</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EnterCode

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.white,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    marginBottom: 8,
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  input: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 2,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 2,
  },
  blackButton: {
    backgroundColor: COLOR.primary,
  },
  whiteButton: {
    backgroundColor: COLOR.white,
    borderColor: COLOR.primary,
  },
  blackText: {
    color: '#000',
  },
  whiteText: {
    color: COLOR.white,
  },
  videoFrame: {
    width: '90%',
    height: '50%',
    marginTop: 20,
    borderRadius: 10,
  },
})
