import React, { useState } from "react"
import { useSelector } from "react-redux"
import { RTCView } from "react-native-webrtc"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"

import COLOR from "../../../../theme"
import { windowWidth } from "../../../../constants"
import { selectUserId } from "../../../../redux/slices/AuthenticationSlice"
import { selectLocalStream, selectOtherPeers } from "../../../../redux/slices/ConnectionSlice"

const FRAME_WIDTH = windowWidth - 54

const TwoPeerLayout = () => {
  const userId = useSelector(selectUserId)
  const peers = [{id: '1', remoteStream: undefined}]//useSelector(selectOtherPeers)
  const localStream = useSelector(selectLocalStream)
  const [focusIndex, setFocusIndex] = useState(-1)

  const changeLayoutFocus = (id) => {
    if (id == userId) {
      setFocusIndex(focusIndex == 0 ? -1 : 0)
    } else {
      setFocusIndex(focusIndex == 1 ? -1 : 1)
    }
  }

  const SinglePersonFrame = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => changeLayoutFocus(item.id)}>
        <View
          style={[styles.singlePersonFrame, {
            height: focusIndex == -1 ? '43%' : '93%',
            borderWidth: focusIndex == -1 ? 0 : StyleSheet.hairlineWidth,
          }]}
        >
          {
            item.remoteStream ?
            <RTCView
              mirror={false}
              style={styles.frameContent}
              streamURL={item.remoteStream.toURL()}
              objectFit={focusIndex != -1 ? 'contain' : 'cover'}
            /> : null
          }

          <View style={styles.frameInfoRow}>
            <Text numberOfLines={1} style={[styles.blackText, styles.nameText]}>
              {item.id == userId ? 'YOU' : item.id}
            </Text>

            {/* <Ionicons name="mic-outline" size={20} color={'black'}/> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const EqualLayout = () => {
    return (
      <>
        <SinglePersonFrame
          key={'local'}
          item={{
            id: userId,
            remoteStream: localStream
          }}
        />

        {/* remote peers */}
        {
          peers.map((item) => {
            return (
              <SinglePersonFrame key={item.id} item={item}/>
            )
          })
        }
      </>
    )
  }

  const FocusLayout = () => {
    const currentUser = {
      id: userId,
      remoteStream: localStream
    }
    const item = focusIndex == 0 ? peers[0] : currentUser

    return (
      <>
        <SinglePersonFrame item={focusIndex == 0 ? currentUser : peers[0]}/>

        <View style={styles.myFrameOnFocus}>
          {
            item.remoteStream ?
            <RTCView
              zOrder={2}
              mirror={false}
              objectFit={'cover'}
              streamURL={item.remoteStream.toURL()}
              style={[styles.frameContent, {borderRadius: 10}]}
            />
            : null
          }
        </View>
      </>
    )
  }

  return (
    <ScrollView
      horizontal={false}
      style={styles.mainSection}
      contentContainerStyle={{flex: 1}}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {
          focusIndex == -1 ? <EqualLayout /> : <FocusLayout />
        }
      </View>
    </ScrollView>
  )
}

export default React.memo(TwoPeerLayout)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '92%',
    flexWrap: 'wrap',
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.black
  },
  mainSection: {
    marginTop: 12
  },
  singlePersonFrame: {
    zIndex: 1,
    height: '43%',
    borderWidth: 0,
    borderRadius: 24,
    width: FRAME_WIDTH,
    marginVertical: 16,
    overflow: 'hidden',
    marginHorizontal: 12,
    backgroundColor: 'white',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  frameContent: {
    flex: 1,
    borderRadius: 24,
  },
  nameText: {
    width: '88%',
  },
  blackText: {
    color: COLOR.black
  },
  frameInfoRow: {
    left: 16,
    bottom: 16,
    width: '34%', //38
    borderRadius: 4,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    position: 'absolute',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  },
  myFrameOnFocus: {
    top: 34,
    right: 40,
    zIndex: 2,
    width: '19%',
    height: '19%',
    borderWidth: 0,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'absolute',
    borderColor: COLOR.gray,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  }
})