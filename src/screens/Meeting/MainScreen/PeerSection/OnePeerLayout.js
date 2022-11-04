import React, { useState } from "react"
import { useSelector } from "react-redux"
import { RTCView } from "react-native-webrtc"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"

import COLOR from "../../../../theme"
import { windowWidth } from "../../../../constants"
import { selectUserId } from "../../../../redux/slices/AuthenticationSlice"
import { selectLocalStream } from "../../../../redux/slices/ConnectionSlice"

const FRAME_WIDTH = windowWidth - 48

const OnePeerLayout = () => {
  const userId = 'YOU'
  const localStream = useSelector(selectLocalStream)

  return (
    <ScrollView
      horizontal={false}
      style={styles.mainSection}
      contentContainerStyle={{flex: 1}}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.singlePersonFrame}>
          {
            localStream ?
            <RTCView
              mirror={false}
              objectFit={'cover'}
              style={styles.frameContent}
              streamURL={localStream.toURL()}
            /> : null
          }

          <View style={styles.frameInfoRow}>
            <Text numberOfLines={1} style={[styles.blackText, styles.nameText]}>{userId}</Text>

            {/* <Ionicons name="mic-outline" size={20} color={'black'}/> */}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default React.memo(OnePeerLayout)

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
    height: '90%',
    borderWidth: 0,
    borderRadius: 24,
    width: FRAME_WIDTH,
    marginVertical: 16,
    overflow: 'hidden',
    marginHorizontal: 12,
    borderColor: COLOR.gray,
    backgroundColor: 'white',
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
})