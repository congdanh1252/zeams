import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc'
import io from 'socket.io-client'
import firestore from '@react-native-firebase/firestore'
import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import COLOR from "../../../theme"
import BottomStack from "./BottomStack"
import MainSection from "./MainSection"
import { SERVER_URL, statusBarHeight, windowWidth } from "../../../constants"

const servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
}
const mediaConstraints = {
  audio: true,
  video: {
    frameRate: 60,
    facingMode: 'user', // 'user'
    width: { min: 720, ideal: 1920, max: 1440 },
    height: { min: 640, ideal: 1080, max: 2560 },
  },
}
const sessionConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
}
const connection = io(SERVER_URL, {transports: ['websocket']})
//trigger even screen not render yet -> useRef

export const MainScreen = ({ navigation, route }) => {
  // const { action, code } = 'create'//route?.params 
  const peerConnection = useRef(null)
  const [ready, setReady] = useState(false)
  const [muted, setMuted] = useState(false)
  const [localMediaStream, setLocalMediaStream] = useState(undefined)
  const [remoteMediaStream, setRemoteMediaStream] = useState(undefined)

  const switchCamera = () => {
    if (localMediaStream && localMediaStream != undefined) {
      localMediaStream?.getVideoTracks().forEach(track => track._switchCamera())
    }
  }

  const toggleMute = () => {
    if (!remoteMediaStream || remoteMediaStream == undefined ||
        localMediaStream == undefined || !localMediaStream) {
      return
    }

    localMediaStream?.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled
    })
    setMuted(!muted)
  }

  const handleCleanUpConnection = () => {
    if (peerConnection.current && peerConnection.current != null) {
      // peerConnection.current.removeTrack()
      peerConnection.current.removeEventListener('track', () => {})
      peerConnection.current.removeEventListener('icecandidate', () => {})
      peerConnection.current.removeEventListener('negotiationneeded', () => {})
      peerConnection.current.removeEventListener('connectionstatechange', () => {})
      peerConnection.current.removeEventListener('iceconnectionstatechange', () => {})

      peerConnection.current?.getTransceivers()?.forEach(transceiver => {
        transceiver.stop()
      })

      if (localMediaStream != undefined) {
        localMediaStream.getTracks().map(track => {
          track.stop()
        })
      }

      peerConnection.current.close()
      peerConnection.current = null
      setLocalMediaStream(undefined)
      setRemoteMediaStream(undefined)
    }
  }

  const hangUpCall = () => {
    if (peerConnection.current != null && peerConnection.current) {
      handleCleanUpConnection()

      sendToServer({
        type: 'hang-up'
      })
    }
  }

  const sendToServer = (msg) => {
    connection.emit('message', JSON.stringify(msg))
  }

  const connectServer = () => {
    connection.on('connect', () => {
      setReady(true)
      console.log('IO connected')
    })

    connection.on('message', async (msg) => {
      const obj = JSON.parse(msg)
      switch(obj?.type) {
        case 'id':
          break
        case 'message':
          console.log(msg)
          break
        case 'offer':
          try {
            if (!peerConnection.current || peerConnection.current == null) {
              console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
              createPeerConnection()
            }

            if (obj.data != peerConnection.current?.localDescription) {
              console.log('Set offer as remote description')
              if (peerConnection.current?.signalingState != 'stable') {
                await Promise.all([
                  peerConnection.current?.setLocalDescription({type: "rollback"}),
                  peerConnection.current?.setRemoteDescription(obj?.data)
                ])
              } else {
                peerConnection.current.setRemoteDescription(obj?.data)
              }
            }

            peerConnection.current.createAnswer(sessionConstraints)
            .then(answerDescription => {
              peerConnection.current.setLocalDescription(answerDescription)

              sendToServer({
                type: "answer",
                data: answerDescription
              })
            })

            console.log('Received message: offer')
          } catch (e) {

          }
          break
        case 'answer':
          peerConnection.current.setRemoteDescription(obj.data)
          console.log('Received message: answer')
          break
        case 'ice-candidate':
          try {
            peerConnection.current.addIceCandidate(new RTCIceCandidate(obj.data))
            console.log('Received message: ice-candidate')
          } catch(err) {
            
          }
          break
        case 'hang-up':
          handleCleanUpConnection()
          break
        default:
          console.log('Unknown received message: ' + obj.type)
      }
    })

    connection.on('connect-error', () => {
      console.log('IO connected error')
    })
  }

  const createPeerConnection = () => {
    if (!peerConnection.current || peerConnection.current == null) {
      peerConnection.current = new RTCPeerConnection(servers)

      mediaDevices.getUserMedia(mediaConstraints)
      .then(stream => {
        setLocalMediaStream(stream)
        stream?.getTracks().forEach(track => {
          peerConnection?.current?.addTrack(track)
        })
      })

      peerConnection.current?.addEventListener('icecandidate', event => {
        if (event.candidate) {
          sendToServer({
            type: 'ice-candidate',
            data: event.candidate
          })
        }
      })

      peerConnection.current?.addEventListener('track', event => {
        let remoteStream = new MediaStream()
          console.log('In Track')
          if (event.streams[0] != undefined) {
            console.log('streams[0]')
            event.streams[0].getTracks().forEach(track => {
              remoteStream.addTrack(track)
            })
          } else {
            console.log('event.track')
            remoteStream = new MediaStream([event.track])
          }
          setRemoteMediaStream(remoteStream)
      })

      peerConnection.current?.addEventListener('negotiationneeded', event => {
        console.log("---------------Negotiation needed--------------")
        if (peerConnection.current?.signalingState != 'stable') {
          return
        }
        peerConnection.current?.createOffer(sessionConstraints)
        .then(offerDescription => {
          peerConnection.current?.setLocalDescription(offerDescription)

          sendToServer({
            type: 'offer',
            data: offerDescription
          })
        })
      })

      peerConnection.current?.addEventListener('connectionstatechange', event => {
        console.log("------Connection state: " + peerConnection.current?.connectionState + "\n")
      })

      peerConnection.current?.addEventListener( 'iceconnectionstatechange', event => {
        console.log("-----------ICE Connection state: " + peerConnection.current?.iceConnectionState + "\n")
      })
    }
  }

  const startCall = () => {
    createPeerConnection()
  }

  // handle WebRTC works
  useEffect(() => { 
    connectServer()
  }, [])

  return (
    <View style={styles.container}>
      <MainSection
        localStream={localMediaStream}
        remoteStream={remoteMediaStream}
      />
      
      {
        ready ?
        <TouchableOpacity
          onPress={startCall}
          activeOpacity={0.7}
          style={styles.callBtn}
        >
          <Text style={styles.readyText}>• You're ready to go</Text>
        </TouchableOpacity>
        : null
      }

      <BottomStack
        switchCamera={switchCamera}
        hangUp={hangUpCall}
        isMuted={muted}
        toggleMute={toggleMute}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight,
    backgroundColor: COLOR.black
  },
  callBtn: {
    top: 4,
    padding: 2,
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
  },
  readyText: {
    color: '#0ECB81',
  }
})