import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import COLOR from '../../../theme'
import { VISUAL_IMG } from '../../../assets'
import BackButton from '../../../components/BackButton'

const ERROR_TEXT = {
  BLANK_CODE: 'Blank room code',
  WRONG_CODE: 'Make sure you have entered correct code'
}

export const EnterCode = ({route, navigation}) => {
  const [roomCode, setRoomCode] = useState('')
  const [errorText, setErrorText] = useState('')

  const goBack = () => {
    navigation.goBack()
  }

  const navigateReadyScreen = () => {
    navigation.navigate('JoinMeeting', {
      action: 'join',
      roomId: roomCode
    })
  }

  const checkRoomCodeExist = () => {
    if (roomCode != '') {
      firestore().collection('rooms')
      .get()
      .then(querySnapshot => {
        let exist = false
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data()?.roomId == roomCode) {
            exist = true
            navigateReadyScreen()
            return
          }
        })
        if (!exist) {
          setErrorText(ERROR_TEXT.WRONG_CODE)
        }
      })
    } else {
      setErrorText(ERROR_TEXT.BLANK_CODE)
    }
  }

  return (
    <KeyboardAwareScrollView
      scrollEnabled={false}
      enableOnAndroid={true}
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      extraScrollHeight={Platform.OS == 'ios' ? 42 : -50}
    >
      <BackButton onPress={goBack}/>

      <View style={styles.logo}>
        <Image
          style={styles.logo}
          source={VISUAL_IMG}
          resizeMode='cover'
        />
      </View>

      <Text style={styles.text}>
        Enter the code provided by the meeting organiser
      </Text>

      <View style={errorText != '' ? styles.errorInputHolder : styles.inputHolder}>
        <TextInput
          value={roomCode}
          numberOfLines={1}
          multiline={false}
          style={styles.input}
          placeholder="Enter code"
          keyboardType='default'
          autoCapitalize='characters'
          placeholderTextColor={COLOR.drakGray}
          onChangeText={val => {
            if (errorText != '') {
              setErrorText('')
            }
            setRoomCode(val)
          }}
          onSubmitEditing={checkRoomCodeExist}
        />
      </View>

      {
        errorText != '' ?
        <Text style={styles.errorText}>{errorText}</Text>
        : null
      }

      <TouchableOpacity
        onPress={checkRoomCodeExist}
        style={[styles.button, styles.blackButton]}
      >
        <Text style={styles.whiteText}>Join</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  )
}

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
    color: COLOR.drakGray,
  },
  logo: {
    width: 340,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputHolder: {
    width: '80%',
    height: 46,
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 12,
    // borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorInputHolder: {
    width: '80%',
    height: 46,
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 12,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '90%',
    textAlign: 'center',
    color: COLOR.black,
  },
  button: {
    height: 46,
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    padding: 10,
    marginTop: 16,
    borderRadius: 5,
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
  errorText: {
    width: '80%',
    color: 'red',
    marginTop: 8,
    textAlign: 'left',
  }
})
