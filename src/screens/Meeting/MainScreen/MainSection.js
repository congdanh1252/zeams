import React from "react"
import { useSelector } from "react-redux"
import { RTCView } from "react-native-webrtc"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"

import COLOR from "../../../theme"
import { windowWidth } from "../../../constants"
import { selectUserId } from "../../../redux/slices/AuthenticationSlice"

const calculateFrameSize = (total) => {
  let width = 0
  let height = 0
  const FRAME_WIDTH = windowWidth - 48

  switch (total) {
    case 4:
      width = FRAME_WIDTH / 2
      height = '42%'
      break
    case 3:
      width = FRAME_WIDTH / 2
      height = '42%'
      break
    default:
      width = FRAME_WIDTH
      height = '42%'
  }

  return {
    width,
    height
  }
}

const MainSection = ({ peers, localStream }) => {
  const FRAME_WIDTH = windowWidth - 48
  const userId = useSelector(selectUserId)
  const SIZE = calculateFrameSize(peers.length + 1)

  const SinglePersonFrame = ({ item }) => {
    return (
      <View
        style={[
          styles.singlePersonFrame, {
            width: SIZE.width,
            height: SIZE.height,
          }
        ]}
      >
        {
          item.remoteStream ?
          <RTCView
            mirror={false}
            objectFit={'cover'}
            style={styles.frameContent}
            streamURL={item.remoteStream?.toURL()}
          />
          :
          <ActivityIndicator size='large' color={'black'} style={styles.loadingIndicator}/>
        }

        <View style={[styles.frameInfoRow, {width: SIZE.width < FRAME_WIDTH ? '80%' : '34%'}]}>
          <Text numberOfLines={1} style={[styles.blackText, styles.nameText]}>{item.id}</Text>

          {/* <Ionicons name="mic-outline" size={20} color={'black'}/> */}
        </View>
      </View>
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
        <SinglePersonFrame
          key={'local'}
          item={{
            id: userId,
            remoteStream: localStream
          }}
        />

        {
          peers.map((item) => {
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
    borderWidth: 1,
    borderRadius: 24,
    marginVertical: 16,
    overflow: 'hidden',
    marginHorizontal: 12,
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
  },
  loadingIndicator: {
    marginTop: '35%'
  }
})