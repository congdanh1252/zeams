import React, { useState, useEffect } from 'react'
import {
  RTCView,
  mediaDevices,
} from 'react-native-webrtc'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import COLOR from '../../../theme'

export const JoinMeeting = ({ navigation, route }) => {
  const { action, code } = route?.params
  const isVoiceOnly = false
  const mediaConstraints = {
    audio: true,
    video: {
      frameRate: 60,
      facingMode: 'user', // 'user'
    },
  }
  const [isMicEnable, setIsMicEnable] = useState(true)
  const [isCamEnable, setIsCamEnable] = useState(true)
  const [localMediaStream, setLocalMediaStream] = useState(undefined)

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
        code: code
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
      <Text style={styles.blackText}>abc-defg-xyz</Text>
      {localMediaStream != undefined ? (
        <RTCView
          zOrder={50}
          mirror={false}
          objectFit={'cover'}
          style={styles.videoFrame}
          streamURL={localMediaStream.toURL()}
        />
      ) : null}

      <View
        style={{
          display: 'flex',
          width: '50%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
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
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={handleJoiningMeet}
          style={[styles.button, styles.blackButton]}
        >
          <Ionicons
            style={{marginRight: 4}}
            size={20}
            name="videocam-outline"
            color={COLOR.white}
          />
          <Text style={styles.whiteText}>Join</Text>
        </TouchableOpacity>
        <Text style={styles.blackText}>Joining as</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 2,
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
    fontWeight: 'bold',
    fontSize: 20,
  },
  videoFrame: {
    width: '50%',
    height: '50%',
    marginVertical: 20,
    borderRadius: 20,
  },
  icon: {
    padding: 8,
    borderRadius: 10,
    borderColor: COLOR.primary,
    borderWidth: 1,
  },
})
