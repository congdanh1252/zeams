import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
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

export const MainScreen = ({ navigation, route }) => {
  const { action, code } = route?.params
  const peerConnection = useRef(new RTCPeerConnection(servers))
  const [localMediaStream, setLocalMediaStream] = useState(undefined)
  const [remoteMediaStream, setRemoteMediaStream] = useState(undefined)

  // handle WebRTC works
  useEffect(() => {
    let channelSubscriber = undefined
    let answerCansSubscriber = undefined
    let offerCansSubscriber = undefined

    const handleMediaStream = () => {
      try {
        let remoteStream = new MediaStream()
        mediaDevices.getUserMedia(mediaConstraints)
        .then(stream => {
          setLocalMediaStream(stream)
          stream?.getTracks().forEach(track => {
            peerConnection.current?.addTrack(track)
          })
        })

        // Pull tracks from remote stream, add to video stream
        peerConnection.current.addEventListener('track', event => {
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
      } catch (error) {

      }
    }

    handleMediaStream()

    if (action == 'join') {
      try {
        const channelDoc = firestore().collection('channels').doc(code)
        const offerCandidates = channelDoc.collection('offerCandidates')
        const answerCandidates = channelDoc.collection('answerCandidates')

        peerConnection.current.addEventListener('icecandidate', async event => {
          if (event.candidate) {
            await answerCandidates.add(event.candidate.toJSON())
          }
        })

        channelDoc
        .get()
        .then(channelDocument => {
          const offerDescription = channelDocument?.data()?.offer

          peerConnection.current
          .setRemoteDescription(new RTCSessionDescription(offerDescription))
          .then(() => {

            peerConnection.current
            .createAnswer(sessionConstraints)
            .then(answerDescription => {

              peerConnection.current
              .setLocalDescription(answerDescription)
              .then(() => {
                const offer = offerDescription
                const answer = {
                  type: answerDescription.type,
                  sdp: answerDescription.sdp,
                }
        
                channelDoc.set({ answer, offer })
    
                offerCandidates
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach((documentSnapshot) => {
                    peerConnection.current.addIceCandidate(new RTCIceCandidate(documentSnapshot.data()))
                  })
                })
              })
            })

            // CHECK THIS
            if (offerCansSubscriber == undefined) {
              offerCansSubscriber = offerCandidates.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                  if (change.type === 'added') {
                    const data = change.doc.data()
                    peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
                  }
                })
              })
            }
          })
        })
      } catch (err) {
        // Handle Error
      }
    } else if (action == 'create') {
      const channelDoc = firestore().collection('channels').doc()
      const offerCandidates = channelDoc.collection('offerCandidates')
      const answerCandidates = channelDoc.collection('answerCandidates')

      peerConnection.current.addEventListener('icecandidate', async event => {
        if (event.candidate) {
          await offerCandidates.add(event.candidate.toJSON())
        }
      })

      //create offer
      peerConnection.current
      .createOffer(sessionConstraints)
      .then(offerDescription => {
        peerConnection.current.setLocalDescription(offerDescription)

        const offer = {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        }
  
        channelDoc.set({ offer })

        // Listen for remote answer
        if (channelSubscriber == undefined) {
          channelSubscriber =
            channelDoc.onSnapshot(snapshot => {
              const data = snapshot.data()
              if (!peerConnection.current.remoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer)
                peerConnection.current.setRemoteDescription(answerDescription)

                // When answered, add candidate to peer connection
                if (answerCansSubscriber == undefined) {
                  answerCansSubscriber =
                    answerCandidates.onSnapshot(snapshot => {
                      snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                          const data = change.doc.data()
                          peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
                        }
                      })
                    })
                }
              }
            })
        }
      })
    }

    return () => {
      if (localMediaStream != undefined) {
        localMediaStream
        .getTracks()
        .map(track => {
          track.stop()
        })
      }
      peerConnection.current?.close()
      peerConnection.current = undefined
      channelSubscriber != undefined ? channelSubscriber() : null
      offerCansSubscriber != undefined ? offerCansSubscriber() : null
      answerCansSubscriber != undefined ? answerCansSubscriber() : null 
    }
  }, [])

  return (
    <View style={styles.container}>
      <MainSection
        localStream={localMediaStream}
        remoteStream={remoteMediaStream}
      />

      <BottomStack />
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