import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc'
import notifee from '@notifee/react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native'

import COLOR from '../../../theme'
import BottomStack from './BottomStack'
import PeerSection from './PeerSection'
import { statusBarHeight } from '../../../constants'
import { selectUserId } from '../../../redux/slices/AuthenticationSlice'
import { connection, convertCodeToDisplay, createNotifeeChannel } from '../../../utils'
import { selectLocalStream, updateLocalStream, updateOtherPeers } from '../../../redux/slices/ConnectionSlice'

const servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  // iceServers: [
  //   {
  //     urls: [
  //       'stun:ss-turn1.xirsys.com',
  //     ],
  //   },
  //   {
  //     username:
  //       'TPxCeOaokQy5SPcXfxNeyC0nTnL6JHW8iQ-Da55FybVpERztXsYAQnnvozRL1dlOAAAAAGNfgcZjb25nZGFuaDEyNTI=',
  //     credential: 'c70842ae-58f2-11ed-bbe6-0242ac140004',
  //     urls: [
  //       'turn:ss-turn1.xirsys.com:80?transport=udp',
  //       'turn:ss-turn1.xirsys.com:3478?transport=udp',
  //       'turn:ss-turn1.xirsys.com:80?transport=tcp',
  //       'turn:ss-turn1.xirsys.com:3478?transport=tcp',
  //       'turns:ss-turn1.xirsys.com:443?transport=tcp',
  //       'turns:ss-turn1.xirsys.com:5349?transport=tcp',
  //     ],
  //   },
  // ],
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

export const MainScreen = ({ navigation, route }) => {
  const { action, roomId, roomRef } = route?.params
  const dispatch = useDispatch()
  const otherPeers = useRef([])
  const [others, setOthers] = useState([])
  const userId = useSelector(selectUserId)
  const [muted, setMuted] = useState(false)
  const [docRef, setDocRef] = useState(roomId)
  const [isSharing, setIsSharing] = useState(false)
  const localStream = useSelector(selectLocalStream)
  const [initialising, setInitialising] = useState(true)

  const deepClonePeers = () => {
    dispatch(
      updateOtherPeers({
        otherPeers: [...otherPeers.current]
      })
    )
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
    mediaDevices.getUserMedia(mediaConstraints).then(stream => {
      dispatch(updateLocalStream({ localStream: stream }))
    })
  }

  const shareScreen = async () => {
    await createNotifeeChannel()

    mediaDevices.getDisplayMedia({video: true})
    .then(stream => {
      setIsSharing(true)

      otherPeers.current.forEach(peer => {
        peer.peerConnection
        .getSenders().forEach(sender => {
          sender.replaceTrack(stream.getVideoTracks()[0])
        })
      })
    })
  }

  const stopScreenSharing = async () => {
    try {
      await notifee.stopForegroundService()
      await notifee.deleteChannel('screen_capture')

      otherPeers.current.forEach(peer => {
        peer.peerConnection
        .getSenders().forEach(sender => {
          sender.replaceTrack(localStream.getVideoTracks()[0])
        })
      })
      
      setIsSharing(false)
    } catch (e) {

    }
  }

  const switchCamera = () => {
    if (localStream) {
      localStream?.getVideoTracks().forEach(track => track._switchCamera())
    }
  }

  const toggleMute = () => {
    localStream?.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled
    })
    setMuted(!muted)
  }

  const handleCleanUpConnection = (which) => {
    if (which == 'all') {
      if (otherPeers.current.length > 0) {
        otherPeers.current?.forEach(item => {
          item.peerConnection?.removeEventListener('track', () => null)
          item.peerConnection?.removeEventListener('icecandidate', () => null)
          item.peerConnection?.removeEventListener('negotiationneeded', () => null)
          item.peerConnection?.removeEventListener('connectionstatechange', () => null)
          item.peerConnection?.removeEventListener('iceconnectionstatechange', () => null)

          item.peerConnection?.getTransceivers()?.forEach(transceiver => {
            transceiver.stop()
          })
          item.peerConnection?.close()
          item.peerConnection = null
        })
        // others?.forEach(item => {
        //   item.peerConnection?.removeEventListener('track', () => null)
        //   item.peerConnection?.removeEventListener('icecandidate', () => null)
        //   item.peerConnection?.removeEventListener('negotiationneeded', () => null)
        //   item.peerConnection?.removeEventListener('connectionstatechange', () => null)
        //   item.peerConnection?.removeEventListener('iceconnectionstatechange', () => null)

        //   item.peerConnection?.getTransceivers()?.forEach(transceiver => {
        //     transceiver.stop()
        //   })
        //   item.peerConnection?.close()
        //   item.peerConnection = null
        // })

        if (localStream) {
          localStream.getTracks().map(track => {
            track.stop()
          })
        }

        connection.off()
        connection.removeAllListeners()
        connection.disconnect()
        connection.close()
        setOthers([])
        otherPeers.current = []
        dispatch(updateLocalStream({ localStream: undefined }))
        console.log('-------Clean up connection------')
      }
    } else {
      otherPeers.current[which]?.peerConnection?.removeEventListener('track', () => null)
      otherPeers.current[which]?.peerConnection?.removeEventListener('icecandidate', () => null)
      otherPeers.current[which]?.peerConnection?.removeEventListener('negotiationneeded', () => null)
      otherPeers.current[which]?.peerConnection?.removeEventListener('connectionstatechange', () => null)
      otherPeers.current[which]?.peerConnection?.removeEventListener('iceconnectionstatechange', () => null)

      otherPeers.current[which]?.peerConnection?.getTransceivers()?.forEach(transceiver => {
        transceiver.stop()
      })
      otherPeers.current[which]?.peerConnection?.close()
      otherPeers.current[which].peerConnection = undefined

      // others[which]?.peerConnection?.removeEventListener('track', () => null)
      // others[which]?.peerConnection?.removeEventListener('icecandidate', () => null)
      // others[which]?.peerConnection?.removeEventListener('negotiationneeded', () => null)
      // others[which]?.peerConnection?.removeEventListener('connectionstatechange', () => null)
      // others[which]?.peerConnection?.removeEventListener('iceconnectionstatechange', () => null)

      // others[which]?.peerConnection?.getTransceivers()?.forEach(transceiver => {
      //   transceiver.stop()
      // })
      // others[which]?.peerConnection?.close()
      // others[which].peerConnection = undefined

      if (localStream) {
        localStream.getTracks().map(track => {
          track.stop()
        })
      }

      otherPeers.current.splice(which, 1)
      deepClonePeers()
    }
    deepClonePeers()
  }

  const hangUpCall = () => {
    sendToServer({
      type: 'hang-up',
      roomId: roomId,
      roomRef: docRef,
      sender: userId,
    })
    handleCleanUpConnection('all')

    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeStack' }],
    })
  }

  const sendToServer = (msg) => {
    connection.emit('message', JSON.stringify(msg))
  }

  const connectServer = () => {
    sendToServer({
      type: 'join',
      roomId: roomId,
      roomRef: roomRef,
      data: {
        sender: userId,
      },
      create: action == 'join' ? false : true,
    })

    connection.on('message', async (msg) => {
      const obj = JSON.parse(msg)
      switch (obj?.type) {
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
                  peerConnection: undefined,
                })
              }
            })
            otherPeers.current = arr
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
                  peerConnection: undefined,
                })
              }
              const index = findOfferIndex(obj)

              if (!otherPeers.current[index].peerConnection) {
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
                  type: 'answer',
                  roomId: roomId,
                  sender: userId,
                  receiver: otherPeers.current[index]?.id,
                  data: answerDescription,
                })
              })
            }
          } catch (e) {}
          break
        case 'answer':
          if (obj.receiver == userId) {
            const check = findOfferIndex(obj)

            if (check < 0) {
              otherPeers.current.push({
                id: obj.sender,
                remoteStream: undefined,
                peerConnection: undefined,
              })
            }
            const index = findOfferIndex(obj)
            otherPeers.current[index].peerConnection?.setRemoteDescription(obj.data)
          }
          break
        case 'ice-candidate':
          try {
            const check = findOfferIndex(obj)

            if (
              obj.receiver == userId &&
              obj.sender == otherPeers.current[check].id
            ) {
              if (check < 0) {
                otherPeers.current.push({
                  id: obj.sender,
                  remoteStream: undefined,
                  peerConnection: undefined,
                })
                // createPeerConnection(otherPeers.current.length - 1)
              }
              const index = findOfferIndex(obj)
              otherPeers.current[index].peerConnection.addIceCandidate(new RTCIceCandidate(obj.data))
              deepClonePeers()
            }
          } catch (err) {}
          break
        case 'hang-up':
          const index = findOfferIndex(obj)
          handleCleanUpConnection(index)
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
    if (!otherPeers.current[index].peerConnection) {
      otherPeers.current[index].peerConnection = new RTCPeerConnection(servers)

      mediaDevices.getUserMedia(mediaConstraints)
      .then(stream => {
        dispatch(updateLocalStream({ localStream: stream }))
        stream?.getTracks().forEach(track => {
          otherPeers.current[index].peerConnection.addTrack(track)
        })

        // replace old tracks in other peers with latest tracks
        otherPeers.current.forEach((peer, idx) => {
          if (idx != index && peer.peerConnection) {
            console.log('REPLACE TRACK')
            peer.peerConnection.getSenders().forEach(sender => {
              sender.replaceTrack(stream.getVideoTracks()[0])
            })
          }
        })
      })

      otherPeers.current[index].peerConnection?.addEventListener('icecandidate', event => {
        if (event.candidate) {
          sendToServer({
            type: 'ice-candidate',
            roomId: roomId,
            sender: userId,
            receiver: otherPeers.current[index].id,
            data: event.candidate,
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
        console.log('---------------Negotiation needed--------------')
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
            data: offerDescription,
          })
        })
      })

      otherPeers.current[index].peerConnection?.addEventListener('connectionstatechange', event => {
        const state = otherPeers.current[index].peerConnection?.connectionState
        if (state == 'connected') {
          deepClonePeers()
        }
        if (state == 'failed') {
          otherPeers.current[index].peerConnection?.restartIce()
        }
        console.log('------Connection state: ' + state + '\n')
      })

      otherPeers.current[index].peerConnection?.addEventListener('iceconnectionstatechange', event => {
        const state = otherPeers.current[index].peerConnection?.iceConnectionState
        if (state == 'completed') {
          deepClonePeers()
        }
        if (state == 'failed') {
          otherPeers.current[index].peerConnection?.restartIce()
        }
        console.log('-----------ICE Connection state: ' + state + '\n')
      })
    }
  }

  const startCall = () => {}

  // initialize socket-io connection
  useEffect(() => {
    preLoadLocalStream()
    connectServer()

    return () => {
      if (isSharing) {
        stopScreenSharing()
      }
      handleCleanUpConnection('all')
    }
  }, [])

  // handle create peerConnection for other peers
  useEffect(() => {
    if (otherPeers.current.length > 0) {
      otherPeers.current.forEach((peer, index) => {
        if (!peer.peerConnection) {
          createPeerConnection(index)
        }
      })
    }
  }, [otherPeers.current])

  // back handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        hangUpCall()
        return true
      },
    )

    return () => backHandler.remove()
  }, [])

  return (
    <View style={styles.container}>
      <PeerSection />

      {/* Code */}
      <TouchableOpacity
        onPress={startCall}
        activeOpacity={0.7}
        style={styles.callBtn}>
        <Text style={styles.roomCodeText}>{convertCodeToDisplay(roomId)}</Text>
      </TouchableOpacity>

      <BottomStack
        isMuted={muted}
        hangUp={hangUpCall}
        isSharing={isSharing}
        toggleMute={toggleMute}
        shareScreen={shareScreen}
        switchCamera={switchCamera}
        stopSharing={stopScreenSharing}
      />

      {/* Overlay */}
      {initialising ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={COLOR.white} />

          <Text
            style={[styles.whiteText, { textAlign: 'center', marginTop: 20 }]}>
            Please wait few seconds{'\n'}to initialise
          </Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight,
    backgroundColor: COLOR.black,
  },
  callBtn: {
    top: 0,
    padding: 2,
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
  },
  roomCodeText: {
    fontSize: 16,
    color: 'white',
    letterSpacing: 2,
    fontWeight: '500',
  },
  whiteText: {
    color: COLOR.white,
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