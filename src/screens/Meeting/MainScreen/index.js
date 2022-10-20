import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc'
import { StyleSheet, View } from "react-native"
import firestore from '@react-native-firebase/firestore'
import React, { useEffect, useRef, useState } from "react"

import COLOR from "../../../theme"
import BottomStack from "./BottomStack"
import MainSection from "./MainSection"
import { statusBarHeight, windowWidth } from "../../../constants"

const servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        // 'stun:stun2.l.google.com:19302',
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

export const MainScreen = ({ navigation, route }) => {
  const { action, code } = route?.params
  const [cachedLocalPC, setCachedLocalPC] = useState()
  const [localMediaStream, setLocalMediaStream] = useState(undefined)
  const [remoteMediaStream, setRemoteMediaStream] = useState(undefined)

  const switchCamera = () => {
    localMediaStream.getVideoTracks().forEach(track => track._switchCamera())
  }

  // handle WebRTC works
  useEffect(() => {
    if (action == 'join') {
      try {
        const peerConnection = new RTCPeerConnection(servers)
        const channelDoc = firestore().collection('channels').doc(code)
        const offerCandidates = channelDoc.collection('offerCandidates')
        const answerCandidates = channelDoc.collection('answerCandidates')

        peerConnection.addEventListener('icecandidate', event => {
          if (!event.candidate) {
            console.log('Got final candidate!')
            return
          }
          answerCandidates.add(event.candidate.toJSON())
        })

        // Pull tracks from remote stream, add to video stream
        peerConnection.addEventListener('track', event => {
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

        mediaDevices.getUserMedia(mediaConstraints)
        .then(stream => {
          setLocalMediaStream(stream)
          stream?.getTracks().forEach(track => {
            peerConnection?.addTrack(track)
          })
        })

        channelDoc
        .get()
        .then(channelDocument => {
          const offerDescription = channelDocument?.data()?.offer

          peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription))

          peerConnection
          .createAnswer(sessionConstraints)
          .then(answerDescription => {
            peerConnection.setLocalDescription(answerDescription)

            const answer = {
              type: answerDescription.type,
              sdp: answerDescription.sdp,
            }
      
            channelDoc.update({ answer })
          })
        })

        offerCandidates.onSnapshot(snapshot => {
          snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
              const data = change.doc.data()
              await peerConnection.addIceCandidate(new RTCIceCandidate(data))
            }
          })
        })

        setCachedLocalPC(peerConnection)
      } catch (err) {
        // Handle Error
      }
    }
    if (action == 'create') {
      // qU1wKfqxKkfGAKDPdWGQ
      const peerConnection = new RTCPeerConnection(servers)
      const channelDoc = firestore().collection('channels').doc()
      const offerCandidates = channelDoc.collection('offerCandidates')
      const answerCandidates = channelDoc.collection('answerCandidates')

      mediaDevices.getUserMedia(mediaConstraints)
      .then(stream => {
        setLocalMediaStream(stream)
        stream?.getTracks().forEach(track => {
          peerConnection?.addTrack(track)
        })
      })

      peerConnection.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          console.log('Got final candidate!')
          return
        }
        offerCandidates.add(event.candidate.toJSON())
      })

      // Pull tracks from remote stream, add to video stream
      peerConnection.addEventListener('track', event => {
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

      //create offer
      peerConnection
      .createOffer(sessionConstraints)
      .then(offerDescription => {
        peerConnection.setLocalDescription(offerDescription)

        const offer = {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        }
  
        channelDoc.set({ offer })
      })

      channelDoc.onSnapshot(snapshot => {
        const data = snapshot.data()
        if (!peerConnection.remoteDescription && data?.answer
            || peerConnection.remoteDescription != data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer)
          peerConnection.setRemoteDescription(answerDescription)
        }
      })

      // When answered, add candidate to peer connection
      answerCandidates.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            const data = change.doc.data()
            peerConnection.addIceCandidate(new RTCIceCandidate(data))
          }
        })
      })

      setCachedLocalPC(peerConnection)
    }

    return () => {
      if (localMediaStream != undefined) {
        localMediaStream
        .getTracks()
        .map(track => {
          track.stop()
        })
      }

      if (cachedLocalPC) {
        cachedLocalPC.close()
        setCachedLocalPC(undefined)
        setLocalMediaStream(undefined)
        setRemoteMediaStream(undefined)
      }
    }
  }, [])

  return (
    <View style={styles.container}>
      <MainSection
        localStream={localMediaStream}
        remoteStream={remoteMediaStream}
      />

      <BottomStack switchCamera={switchCamera}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight,
    backgroundColor: COLOR.black
  },
})