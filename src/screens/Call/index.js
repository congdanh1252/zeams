import React, { useState } from "react"
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
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

import COLOR from "../../theme"

const CallScreen = () => {
  const isVoiceOnly = false
  const mediaConstraints = {
    audio: true,
    video: {
      frameRate: 60,
      facingMode: 'environment' // 'user'
    }
  }
  const [localMediaStream, setLocalMediaStream] = useState(undefined)

  const gettingVideoStream = () => {
    try {
      mediaDevices
      .getUserMedia( mediaConstraints )
      .then(stream => {
        setLocalMediaStream(stream)

        if (isVoiceOnly) {
          let videoTrack = stream.getVideoTracks()[ 0 ]
          videoTrack.enabled = false
        }
      })
    } catch( err ) {
      // Handle Error
    }

  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{ alignItems: 'center' }}
        onPress={gettingVideoStream}
      >
        <Text style={styles.blackText}>Trigger mediaDevices</Text>
        <Ionicons name="camera-outline" size={24} color={'#000'}/>
      </TouchableOpacity>

      {
        localMediaStream != undefined ?
          <RTCView
            zOrder={20}
            mirror={false}
            objectFit={'cover'}
            style={styles.videoFrame}
            streamURL={localMediaStream.toURL()}
          />
        : null
      }
    </View>
  )
}

export default CallScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.white
  },
  blackText: {
    color: '#000'
  },
  videoFrame: {
    width: '90%',
    height: '50%',
    marginTop: 20,
    borderRadius: 10,
  }
})