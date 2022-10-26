import React, { useState, useEffect } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RTCView, mediaDevices } from 'react-native-webrtc'
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Alert } from 'react-native'

import COLOR from '../../../theme'
import BackButton from '../../../components/BackButton'

const isVoiceOnly = false
const mediaConstraints = {
  audio: true,
  video: {
    frameRate: 60,
    facingMode: 'user', // 'user'
  },
}

export const JoinMeeting = ({ navigation, route }) => {
  const { action, roomId } = route?.params
  const [isMicEnable, setIsMicEnable] = useState(true)
  const [isCamEnable, setIsCamEnable] = useState(true)
  const [localMediaStream, setLocalMediaStream] = useState(undefined)

  const goBack = () => {
    navigation.goBack()
  }

  const copyRoomId = () => {
    Clipboard.setString(roomId)

    Alert.alert(
      "COPIED",
      "Room code has been in your clipboard now",
      [
        { text: "OK" }
      ]
    )
  }

  const convertCodeToDisplay = (code) => {
    let result = '';
    [...code].forEach((char, index) => {
      if (index == 2) {
        result += char + '-'
      } else {
        result += char
      }
    })

    return result
  }

  const handleJoiningMeet = () => {
    if (localMediaStream != undefined) {
      localMediaStream
      .getTracks()
      .map(track => {
        track.stop()
      })
      setLocalMediaStream(undefined)
      console.log('Clean up local media stream in ready screen!')
    }

    navigation.navigate(
      'MeetingScreen', {
        action: action,
        roomId: roomId
      }
    )
  }

  // get media stream
  useEffect(() => {
    const gettingVideoStream = () => {
      try {
        mediaDevices.getUserMedia(mediaConstraints)
        .then(stream => {
          setLocalMediaStream(stream)
  
          if (isVoiceOnly) {
            let videoTrack = stream.getVideoTracks()[0]
            videoTrack.enabled = false
          }
        })
      } catch (err) {
        // Handle Error
      }
    }

    gettingVideoStream()
  }, [])

  return (
    <View style={styles.container}>
      <BackButton onPress={goBack}/>

      <Pressable
        onPress={copyRoomId}
        style={({ pressed }) => [
          styles.codeHolder, {
            backgroundColor: pressed ? 'black' : 'white'
          }
        ]}
      >
        {({ pressed }) => (
          <Text style={[pressed ? styles.whiteText : styles.blackText, styles.userText]}>
            {convertCodeToDisplay(roomId)}
          </Text>
        )}
      </Pressable>

      {localMediaStream != undefined ? (
        <View style={styles.videoFrameWrapper}>
          <RTCView
            zOrder={50}
            mirror={false}
            objectFit={'cover'}
            style={styles.videoFrame}
            streamURL={localMediaStream.toURL()}
          />
        </View>
      ) : null}

      <View style={styles.micCamStack}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setIsCamEnable(!isCamEnable)}>
          <Ionicons
            name={'barcode-outline'}
            color={COLOR.primary}
            size={20}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.icon}
          onPress={() => setIsMicEnable(!isMicEnable)}>
          <Ionicons
            name={isMicEnable ? 'mic-outline' : 'mic-off-outline'}
            color={COLOR.primary}
            size={20}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleJoiningMeet}
          style={[styles.button, styles.blackButton]}
        >
          <Ionicons
            style={{marginRight: 8}}
            size={20}
            name="videocam-outline"
            color={COLOR.white}
          />
          <Text style={styles.whiteText}>{action == 'join' ? 'Join' : 'Create'}</Text>
        </TouchableOpacity>
        <Text style={styles.blackText}>Continue as</Text>
        <Text style={[styles.userText, styles.blackText]}>tngcdng@gmail.com</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.white,
  },
  micCamStack: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: '32%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackButton: {
    backgroundColor: COLOR.black,
  },
  blackText: {
    color: '#000',
  },
  whiteText: {
    color: COLOR.white,
  },
  userText: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  videoFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  videoFrameWrapper: {
    width: '50%',
    height: '50%',
    borderRadius: 20,
    marginVertical: 20,
    overflow: 'hidden',
  },
  icon: {
    padding: 8,
    borderRadius: 10,
    borderColor: COLOR.primary,
    borderWidth: 1,
  },
  codeHolder: {
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderColor: COLOR.black,
  }
})
