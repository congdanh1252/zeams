import React, {useState, useEffect} from 'react'
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
} from 'react-native-webrtc'
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

const JoinMeeting = () => {
  const isVoiceOnly = false
  const [isMicEnable, setIsMicEnable] = useState(true)
  const [isCamEnable, setIsCamEnable] = useState(true)

  const mediaConstraints = {
    audio: true,
    video: {
      frameRate: 60,
      facingMode: 'environment', // 'user'
    },
  }
  const [localMediaStream, setLocalMediaStream] = useState(undefined)

  const gettingVideoStream = () => {
    try {
      mediaDevices.getUserMedia(mediaConstraints).then(stream => {
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

  useEffect(() => {
    gettingVideoStream()
  }, [])

  return (
    <View style={styles.container}>
      <Text>abc-defg-xyz</Text>
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
            name={'videocam-off-outline'}
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
        <TouchableOpacity style={[styles.button, styles.blackButton]}>
          <Ionicons
            style={{marginRight: 4}}
            size={20}
            name="videocam-outline"
            color={COLOR.white}
          />
          <Text style={styles.whiteText}>Join</Text>
        </TouchableOpacity>
        <Text>Joining as</Text>
        <Text style={styles.userText}>tngcdng@gmail.com</Text>
      </View>
    </View>
  )
}

export default JoinMeeting

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
