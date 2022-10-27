import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import firestore from '@react-native-firebase/firestore'
import React, { useEffect, useRef, useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import COLOR from "../../../theme"
import BottomStack from "./BottomStack"
import MainSection from "./MainSection"
import { SERVER_URL } from '../../../constants'
import { statusBarHeight } from "../../../constants"
import { connection } from '../../../utils'
import { selectUserId } from '../../../redux/slices/AuthenticationSlice'

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
// const connection = socketInit

export const MainScreen = ({ navigation, route }) => {
  const { action, roomId, roomRef } = route?.params 
  const otherPeers = useRef([])
  const [others, setOthers] = useState([])
  // const peerConnection = useRef(null)
  const userId = useSelector(selectUserId)
  const [ready, setReady] = useState(false)
  const [muted, setMuted] = useState(false)
  const [docRef, setDocRef] = useState(roomId)
  const [initialising, setInitialising] = useState(true)
  const [localMediaStream, setLocalMediaStream] = useState(undefined)
  const [remoteMediaStream, setRemoteMediaStream] = useState(undefined)

  const deepClonePeers = () => {
    let result = []
    const clone = [...otherPeers.current]
    clone.forEach(peer => {
      result.push(Object.assign({}, peer))
    })

    setOthers(result)
  }

  const findOfferIndex = (msg) => {
    let result = -1
    for (let i = 0; i < otherPeers.current.length; i++) {
      const peer = otherPeers.current[i]

      if (peer.id == msg.sender) {
        result = i
        break
      }
    }
    return result
  }

  const preLoadLocalStream = () => {
    mediaDevices.getUserMedia(mediaConstraints)
    .then(stream => {
      setLocalMediaStream(stream)
    })
  }

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
    // if (peerConnection.current && peerConnection.current != null) {
    //   peerConnection.current.removeAllListeners()
    //   // peerConnection.current.removeEventListener('track', () => {})
    //   // peerConnection.current.removeEventListener('icecandidate', () => {})
    //   // peerConnection.current.removeEventListener('negotiationneeded', () => {})
    //   // peerConnection.current.removeEventListener('connectionstatechange', () => {})
    //   // peerConnection.current.removeEventListener('iceconnectionstatechange', () => {})

    //   peerConnection.current?.getTransceivers()?.forEach(transceiver => {
    //     transceiver.stop()
    //   })

    //   if (localMediaStream != undefined) {
    //     localMediaStream.getTracks().map(track => {
    //       track.stop()
    //     })
    //   }

    //   connection.removeAllListeners()
    //   connection.disconnect()
    //   peerConnection.current.close()
    //   peerConnection.current = null
    //   setLocalMediaStream(undefined)
    //   setRemoteMediaStream(undefined)
    //   console.log('-------Clean up connection------')
    // }
  }

  const hangUpCall = () => {
    // if (peerConnection.current != null && peerConnection.current) {
    //   handleCleanUpConnection()

    //   sendToServer({
    //     type: 'hang-up',
    //     roomId: roomId,
    //     data: {
    //       sender: userId,
    //     }
    //   })
    // }
  }

  const sendToServer = (msg) => {
    connection.emit('message', JSON.stringify(msg))
  }

  const connectServer = () => {
    console.log('going to connect')
    sendToServer({
      type: 'join',
      roomId: roomId,
      roomRef: roomRef,
      data: {
        sender: userId
      },
      create: action == 'join' ? false : true
    })
    // connection.on('connect', (socket) => {
    //   console.log('connected')
    //   sendToServer({
    //     type: 'join',
    //     roomId: roomId,
    //     data: {
    //       sender: userId
    //     },
    //     create: action == 'join' ? false : true
    //   })

    //   console.log('IO connected')
    // })

    connection.on('message', async (msg) => {
      const obj = JSON.parse(msg)
      switch(obj?.type) {
        case 'id':
          break
        case 'join':
          if (obj.data.receiver != null && obj.data.receiver == userId) {
            setDocRef(obj.data.docRef)

            let arr = []
            obj.data.participants.forEach(person => {
              if (person != userId) {
                arr.push({
                  id: person,
                  remoteStream: undefined,
                  peerConnection: undefined
                })
              }
            })
            otherPeers.current = arr
            setReady(true)
            setInitialising(false)
          }
          break
        case 'offer':
          try {
            if (obj.receiver == userId) {
              const check = findOfferIndex(obj)

              if (check < 0) {
                otherPeers.current.push({
                  id: obj.sender,
                  remoteStream: undefined,
                  peerConnection: undefined
                })
              }
              const index = findOfferIndex(obj)

              if (!otherPeers.current[index].peerConnection) {
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                createPeerConnection(index)
              }

              if (obj.data != otherPeers.current[index].peerConnection?.localDescription) {
                if (otherPeers.current[index].peerConnection.signalingState != 'stable') {
                  await Promise.all([
                    otherPeers.current[index].peerConnection?.setLocalDescription({type: "rollback"}),
                    otherPeers.current[index].peerConnection?.setRemoteDescription(obj?.data)
                  ])
                } else {
                  otherPeers.current[index].peerConnection?.setRemoteDescription(obj?.data)
                }
              }

              otherPeers.current[index].peerConnection?.createAnswer(sessionConstraints)
              .then(answerDescription => {
                otherPeers.current[index].peerConnection?.setLocalDescription(answerDescription)

                sendToServer({
                  type: "answer",
                  roomId: roomId,
                  sender: userId,
                  receiver: otherPeers.current[index].id,
                  data: answerDescription
                })
              })
            }
          } catch (e) {

          }
          break
        case 'answer':
          if (obj.receiver == userId) {
            const check = findOfferIndex(obj)

            if (check < 0) {
              otherPeers.current.push({
                id: obj.sender,
                remoteStream: undefined,
                peerConnection: undefined
              })
            }
            const index = findOfferIndex(obj)
            otherPeers.current[index].peerConnection?.setRemoteDescription(obj.data)
          }
          break
        case 'ice-candidate':
          try {
            const check = findOfferIndex(obj)

            if (obj.receiver == userId && obj.sender == otherPeers.current[check].id) {
              if (check < 0) {
                otherPeers.current.push({
                  id: obj.sender,
                  remoteStream: undefined,
                  peerConnection: undefined
                })
              }
              const index = findOfferIndex(obj)
              otherPeers.current[index].peerConnection.addIceCandidate(new RTCIceCandidate(obj.data))
              deepClonePeers()
            }
          } catch(err) {
            
          }
          break
        case 'hang-up':
          // handleCleanUpConnection()
          break
        default:
          console.log('Unknown received message: ' + obj.type)
      }
    })

    connection.on('connect-error', () => {
      console.log('IO connected error')
    })
  }

  const createPeerConnection = (index) => {
    if (!otherPeers.current[index].peerConnection || otherPeers.current[index].peerConnection == undefined) {
      console.log(`~ ~ ~ ~ ~ ~ CREATE PEERCONNECTION: ${otherPeers.current[index].id}~ ~ ~ ~ ~ ~`)
      otherPeers.current[index].peerConnection = new RTCPeerConnection(servers)

      mediaDevices.getUserMedia(mediaConstraints)
      .then(stream => {
        setLocalMediaStream(stream)
        stream?.getTracks().forEach(track => {
          otherPeers.current[index].peerConnection.addTrack(track)
        })
      })

      otherPeers.current[index].peerConnection?.addEventListener('icecandidate', event => {
        if (event.candidate) {
          sendToServer({
            type: 'ice-candidate',
            roomId: roomId,
            sender: userId,
            receiver: otherPeers.current[index].id,
            data: event.candidate
          })
        }
      })

      otherPeers.current[index].peerConnection?.addEventListener('track', event => {
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
            otherPeers.current[index].remoteStream = new MediaStream([event.track])
          }
          otherPeers.current[index].remoteStream = remoteStream
          deepClonePeers()
      })

      otherPeers.current[index].peerConnection?.addEventListener('negotiationneeded', event => {
        console.log("---------------Negotiation needed--------------")
        if (otherPeers.current[index].peerConnection?.signalingState != 'stable') {
          return
        }
        otherPeers.current[index].peerConnection?.createOffer(sessionConstraints)
        .then(offerDescription => {
          otherPeers.current[index].peerConnection?.setLocalDescription(offerDescription)

          sendToServer({
            type: 'offer',
            roomId: roomId,
            sender: userId,
            receiver: otherPeers.current[index].id,
            data: offerDescription
          })
        })
      })

      otherPeers.current[index].peerConnection?.addEventListener('connectionstatechange', event => {
        if (otherPeers.current[index].peerConnection?.connectionState == 'connected') {
          deepClonePeers()
        }
        console.log("------Connection state: " + otherPeers.current[index].peerConnection?.connectionState + "\n")
      })

      otherPeers.current[index].peerConnection?.addEventListener( 'iceconnectionstatechange', event => {
        if (otherPeers.current[index].peerConnection?.iceConnectionState == 'completed') {
          deepClonePeers()
        }
        console.log("-----------ICE Connection state: " + otherPeers.current[index].peerConnection?.iceConnectionState + "\n")
      })
    }
  }

  const startCall = () => {
    createPeerConnection()
  }

  // initialize socket-io connection
  useEffect(() => { 
    preLoadLocalStream()
    connectServer()

    return () => {
      handleCleanUpConnection()
    }
  }, [])

  // listen join room event
  // useEffect(() => {
  //   let joiningSubscriber = undefined 

  //   if (roomRef != roomId) {
  //     console.log('\n' + ' - - - - - - - ' + roomRef + ' - - - - - - - ' + '\n')
  //     joiningSubscriber = firestore()
  //     .collection('rooms')
  //     .doc(roomRef)
  //     .onSnapshot(snapshot => {
  //       if (snapshot.exists) {
  //         const participants = snapshot.data()?.participants || []
          
  //       }
  //     })
  //   }

  //   return () => joiningSubscriber ? joiningSubscriber() : null
  // }, [roomRef])

  // handle create peerConnection for other peers
  useEffect(() => {
    if (otherPeers.current.length > 0) {
      otherPeers.current.forEach((peer, index) => {
        console.log("CONNECTION INDEX: " + index)
        createPeerConnection(index)
      })
    }
  }, [otherPeers.current])

  // Xet tu tren xuong duoi, theo join-time tang dan, node phia duoi phai gui offer cho tat ca node phia tren
  // == node vao sau phai gui offer cho tat ca node da~ vao truoc

  // get previous participants in db -> add newly joined user to participants arr -> callback with array of previous
  // -> create ARR.LENGTH peerConnections 

  return (
    <View style={styles.container}>
      <MainSection
        peers={others}
        localStream={localMediaStream}
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
        isMuted={muted}
        hangUp={hangUpCall}
        toggleMute={toggleMute}
        switchCamera={switchCamera}
      />

      {/* Overlay */}
      {
        initialising ?
        <View style={styles.overlay}>
          <ActivityIndicator
            size='large'
            color={COLOR.white}
          />

          <Text style={[styles.whiteText, {textAlign: 'center', marginTop: 20}]}>
            Please wait few seconds{'\n'}to initialise
          </Text>
        </View> : null
      }
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
  },
  whiteText: {
    color: COLOR.white
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
})