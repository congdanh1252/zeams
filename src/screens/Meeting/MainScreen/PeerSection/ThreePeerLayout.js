import React, { useState } from "react"
import { useSelector } from "react-redux"
import { RTCView } from "react-native-webrtc"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"

import COLOR from "../../../../theme"
import { windowWidth } from "../../../../constants"
import { selectUserId } from "../../../../redux/slices/AuthenticationSlice"
import { selectLocalStream, selectOtherPeers } from "../../../../redux/slices/ConnectionSlice"

const FRAME_WIDTH = windowWidth - 72

const ThreePeerLayout = () => {
  const userId = useSelector(selectUserId)
  const peers = useSelector(selectOtherPeers)
  const localStream = useSelector(selectLocalStream)
  const [focusIndex, setFocusIndex] = useState(-1)
  const currentPeers = [{id: userId, remoteStream: localStream}].concat(peers)

  const changeLayoutFocus = (index) => {
    setFocusIndex(index == focusIndex ? -1 : index)
  }

  const SinglePersonFrame = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => changeLayoutFocus(index)}>
        <View
          style={[styles.singlePersonFrame, {
            height: focusIndex == -1 ? '41%' : '20%',
            width: focusIndex == -1 ? (FRAME_WIDTH / 2) : ((FRAME_WIDTH) / 2),
          }]}
        >
          {
            item.remoteStream ?
            <RTCView
              mirror={false}
              objectFit={'cover'}
              style={styles.frameContent}
              streamURL={item.remoteStream.toURL()}
            /> : null
          }

          <View style={styles.frameInfoRow}>
            <Text numberOfLines={1} style={[styles.blackText, styles.nameText]}>{item.id}</Text>

            {/* <Ionicons name="mic-outline" size={20} color={'black'}/> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const FocusFrame = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => changeLayoutFocus(-1)}>
        <View
          style={[styles.singlePersonFrame, {
            height: '61%',
            width: FRAME_WIDTH - 56,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }]}
        >
          {
            item.remoteStream ?
            <RTCView
              mirror={false}
              objectFit={'contain'}
              style={styles.frameContent}
              streamURL={item.remoteStream.toURL()}
            /> : null
          }

          <View style={styles.frameInfoRow}>
            <Text numberOfLines={1} style={[styles.blackText, styles.nameText]}>{item.id}</Text>

            {/* <Ionicons name="mic-outline" size={20} color={'black'}/> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const EqualLayout = () => {
    return (
      <>
        {/* remote peers */}
        {
          currentPeers.map((item, index) => {
            return (
              <SinglePersonFrame key={item.id} item={item} index={index}/>
            )
          })
        }
      </>
    )
  }

  const FocusLayout = () => {
    return (
      <>
        <FocusFrame key={currentPeers[focusIndex].id} item={currentPeers[focusIndex]}/>
        {
          currentPeers.map((item, index) => {
            return (
              index != focusIndex ? <SinglePersonFrame key={item.id} item={item} index={index}/> : null
            )
          })
        }
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
      <View style={styles.equalContainer}>
        {
          focusIndex == -1 ? <EqualLayout /> : <FocusLayout />
        }
      </View>
    </ScrollView>
  )
}

export default React.memo(ThreePeerLayout)

const styles = StyleSheet.create({
  mainSection: {
    marginTop: 12
  },
  equalContainer: {
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
  focusContainer: {
    flex: 1,
    width: '100%',
    height: '92%',
    marginVertical: 6,
    backgroundColor: COLOR.black
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
    backgroundColor: 'black',
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