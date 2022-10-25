import React from "react"
import { RTCView } from "react-native-webrtc"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Image, ScrollView, StyleSheet, Text, View } from "react-native"

import COLOR from "../../../theme"
import { windowWidth } from "../../../constants"

const TEMP = [
  {
    id: 1,
    name: 'Bukayo Saka',
  },
  {
    id: 2,
    name: 'Jadon Sancho'
  }
]

const MainSection = ({ totalPeers, localStream, remoteStream }) => {
  const FRAME_WIDTH = windowWidth - 48

  const SinglePersonFrame = ({ item }) => {
    return (
      <View
        style={[
          styles.singlePersonFrame, {
            width: FRAME_WIDTH,
            height: '42%',
          }
        ]}
      >
        {
          localStream != undefined && item.id == 1 ?
          <RTCView
            mirror={false}
            objectFit={'cover'}
            style={styles.frameContent}
            streamURL={localStream?.toURL()}
          /> : null
        }

        {
          remoteStream != undefined && item.id == 2 ?
          <RTCView
            mirror={false}
            objectFit={'cover'}
            style={styles.frameContent}
            streamURL={remoteStream?.toURL()}
          /> : null
        }

        <View style={styles.frameInfoRow}>
          <Text numberOfLines={1} style={[styles.blackText, styles.nameText]}>{item.name}</Text>

          {/* <Ionicons name="mic-outline" size={20} color={'black'}/> */}
        </View>
      </View>
    )
  }

  return (
    <ScrollView
      horizontal={false}
      contentContainerStyle={{flex: 1}}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {
          TEMP.map((item) => {
            return (
              <SinglePersonFrame key={item.id} item={item}/>
            )
          })
        }
      </View>
    </ScrollView>
  )
}

export default React.memo(MainSection)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '92%',
    marginVertical: 6,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: COLOR.black
  },
  singlePersonFrame: {
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderColor: COLOR.gray,
    backgroundColor: 'white'
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
  }
})