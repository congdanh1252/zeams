import React, { useState } from "react"
import { useSelector } from "react-redux"
import { RTCView } from "react-native-webrtc"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"

import COLOR from "../../../theme"
import { windowWidth } from "../../../constants"
import { selectUserId } from "../../../redux/slices/AuthenticationSlice"

const FRAME_WIDTH = windowWidth - 48

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
  const userId = useSelector(selectUserId)
  const [layout, setLayout] = useState('equal')
  const SIZE = calculateFrameSize(peers.length + 1)

  const changeFocusLayout = () => {
    setLayout(layout == 'equal' ? 'focus' : 'equal')
  }

  const LocalFrameOnFocus = ({ item }) => {
    return (
      <View style={styles.myFrameOnFocus}>
        {
          item.remoteStream ?
          <RTCView
            zOrder={2}
            mirror={false}
            objectFit={'cover'}
            streamURL={item.remoteStream?.toURL()}
            style={[styles.frameContent, {borderRadius: 10}]}
          />
          :
          <ActivityIndicator size='large' color={'black'} style={styles.loadingIndicator}/>
        }
      </View>
    )
  }  

  const SinglePersonFrame = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={changeFocusLayout}>
        <View
          style={[
            styles.singlePersonFrame, {
              width: SIZE.width,
              height: layout == 'equal' ? SIZE.height : '93%',
              backgroundColor: layout == 'equal' ? 'white' : 'black'
            }
          ]}
        >
          {
            item.remoteStream ?
            <RTCView
              mirror={false}
              style={styles.frameContent}
              streamURL={item.remoteStream?.toURL()}
              objectFit={layout == 'equal' ? 'cover' : 'contain'}
            />
            :
            <ActivityIndicator size='large' color={'black'} style={styles.loadingIndicator}/>
          }

          <View style={[styles.frameInfoRow, {width: SIZE.width < FRAME_WIDTH ? '80%' : '34%'}]}>
            <Text numberOfLines={1} style={[styles.blackText, styles.nameText]}>{item.id}</Text>

            {/* <Ionicons name="mic-outline" size={20} color={'black'}/> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
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
          layout == 'equal' ?
          <SinglePersonFrame
            key={'local'}
            item={{
              id: userId,
              remoteStream: localStream
            }}
          /> : null
        }

        {/* remote peers */}
        {
          peers.map((item) => {
            return (
              <SinglePersonFrame key={item.id} item={item}/>
            )
          })
        }

        {
          layout == 'focus' ?
          <LocalFrameOnFocus
            key={'local'}
            item={{
              id: userId,
              remoteStream: localStream
            }}
          /> : null
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
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 24,
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
  loadingIndicator: {
    marginTop: '35%'
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