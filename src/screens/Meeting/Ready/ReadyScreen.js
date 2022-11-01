import { useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
import Clipboard from '@react-native-clipboard/clipboard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RTCView, mediaDevices } from 'react-native-webrtc'
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Alert, ActivityIndicator } from 'react-native'

import COLOR from '../../../theme'
import { convertCodeToDisplay } from '../../../utils'
import BackButton from '../../../components/BackButton'
import { selectUserId } from '../../../redux/slices/AuthenticationSlice'

const isVoiceOnly = false
const mediaConstraints = {
  audio: true,
  video: {
    frameRate: 60,
    facingMode: 'user', // 'user'
  },
}

export const JoinMeeting = ({ navigation, route }) => {
  const { action, roomId, roomRef } = route?.params
  const userId = useSelector(selectUserId)
  const [enableJoin, setEnableJoin] = useState(false)
  const [totalPeople, setTotalPeople] = useState(1)
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
        roomId: roomId,
        roomRef: roomRef || ''
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

  // fetch total participants
  useEffect(() => {
    let listener = undefined
    
    if (action == 'join') {
      listener = firestore().collection('rooms')
      .doc(roomRef)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          const num = snapshot.data()?.participants?.length || 1
          setTotalPeople(num)
        }
      })
    }

    return () => listener ? listener() : null
  }, [])

  // enable join button
  useEffect(() => {
    const preventPress = setTimeout(() => {
      setEnableJoin(true)
    }, 15000)

    return () => clearTimeout(preventPress)
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
      
      {/* Local video stream */}
      {
        localMediaStream != undefined ? (
          <View style={styles.videoFrameWrapper}>
            <RTCView
              zOrder={50}
              mirror={false}
              objectFit={'cover'}
              style={styles.videoFrame}
              streamURL={localMediaStream.toURL()}
            />
          </View>
        ) : null
      }

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

      {/* Total people */}
      {
        action == 'join' ?
        <Text style={[styles.grayText, styles.totalPeopleText]}>{totalPeople} people in already</Text>
        : null
      }

      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {
          enableJoin ?
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
          : <ActivityIndicator style={styles.indicator} size={'large'} color={'black'}/>
        }
        <Text style={styles.blackText}>Continue as</Text>
        <Text style={[styles.userText, styles.blackText]}>{userId}</Text>
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
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackButton: {
    backgroundColor: COLOR.black,
  },
  grayText: {
    opacity: 0.6,
    color: COLOR.black
  },
  totalPeopleText: {
    marginTop: 12,
    width: '52%',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  blackText: {
    color: '#000',
  },
  whiteText: {
    color: COLOR.white,
  },
  userText: {
    fontSize: 19,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  videoFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  videoFrameWrapper: {
    width: '56%',
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
  },
  indicator: {
    marginVertical: 16
  }
})
