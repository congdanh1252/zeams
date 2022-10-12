import React, {useState} from 'react';
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
} from 'react-native-webrtc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import COLOR from '../../theme';

const CallScreen = () => {
  const isVoiceOnly = false;
  const mediaConstraints = {
    audio: true,
    video: {
      frameRate: 60,
      facingMode: 'environment', // 'user'
    },
  };
  const [localMediaStream, setLocalMediaStream] = useState(undefined);

  const gettingVideoStream = () => {
    try {
      mediaDevices.getUserMedia(mediaConstraints).then(stream => {
        setLocalMediaStream(stream);

        if (isVoiceOnly) {
          let videoTrack = stream.getVideoTracks()[0];
          videoTrack.enabled = false;
        }
      });
    } catch (err) {
      // Handle Error
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/Logo.png')}></Image>
      </View>

      <TouchableOpacity style={[styles.button, styles.blackButton]}>
        <Text style={styles.whiteText}>New Meeting</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.whiteButton]}>
        <Text style={styles.blackText}>Join a meeting</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        activeOpacity={0.5}
        style={{alignItems: 'center'}}
        onPress={gettingVideoStream}>
        <Text style={styles.blackText}>Trigger mediaDevices</Text>
        <Ionicons name="camera-outline" size={24} color={'#000'} />
      </TouchableOpacity> */}

      {/* {localMediaStream != undefined ? (
        <RTCView
          zOrder={20}
          mirror={false}
          objectFit={'cover'}
          style={styles.videoFrame}
          streamURL={localMediaStream.toURL()}
        />
      ) : null} */}
    </View>
  );
};

export default CallScreen;

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
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
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
});
