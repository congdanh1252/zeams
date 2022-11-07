import { useSelector } from "react-redux"
import React, { useMemo, useRef, useState } from "react"
import Ionicons from 'react-native-vector-icons/Ionicons'
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import COLOR from "../../../theme"
import { statusBarHeight, windowWidth } from "../../../constants"
import { selectUserId } from "../../../redux/slices/AuthenticationSlice"
import { selectChatMessages } from "../../../redux/slices/ConnectionSlice"

export const ChatBox = ({ roomId, closeCallback, sendMsgCallback }) => {
  const sheetRef = useRef(null)
  const [draft, setDraft] = useState('')
  const userId = useSelector(selectUserId)
  const chatMessages = useSelector(selectChatMessages)

  const snapPoints = useMemo(() => ["100%"], [])

  const renderItem = ({ item }) => {
    return (
      item.sender == userId ? (
        <View style={styles.myMsgContentHolder}> 
          <Text style={styles.whiteText}>{item.content}</Text>
        </View>
      )
      : (
        <View style={styles.peerMessage}>
          <Image
            style={styles.user_photo}
            source={{uri: 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'}}
          />

          <View style={styles.withNameContainer}>
            <Text style={styles.peerName}>{item.sender}</Text>

            <View style={styles.peerMsgContentHolder}>
              <Text style={styles.blackText}>{item.content}</Text>
            </View>
          </View>
        </View>
      )
    )
  }

  const handleSendMsg = () => {
    if (draft != '') {
      sendMsgCallback({
        type: 'chat',
        sender: userId,
        content: draft,
        roomId: roomId,
        createdAt: new Date().getTime(),
        contentType: draft != '' ? 'text' : 'file'
      })
      setDraft('')
    }
  }

  return (
    <View style={styles.overlay}>
      <BottomSheet
        index={0}
        ref={sheetRef}
        animateOnMount
        enableOverDrag={false}
        snapPoints={snapPoints}
        onClose={closeCallback}
        style={styles.container}
        handleStyle={{display: 'none'}}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.closeBtn}>
              <Ionicons name="close-outline" color={'black'} size={22}/>
            </View>

            <Text style={styles.title}>Chat</Text>

            <TouchableOpacity
              onPress={closeCallback}
              style={styles.closeBtn}
            >
              <Ionicons name="close-outline" color={'white'} size={22}/>
            </TouchableOpacity>
          </View>

          <BottomSheetFlatList
            inverted
            data={chatMessages}
            renderItem={renderItem}
            style={styles.chatSection}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageList}
          />

          <View style={styles.bottomStack}>
            <TouchableOpacity style={styles.addFileBtn}>
              <Ionicons name="add-circle-outline" color={'black'} size={28}/>
            </TouchableOpacity>

            <TextInput
              value={draft}
              multiline={true}
              style={styles.input}
              returnKeyType={'done'}
              placeholder={'Type something'}
              placeholderTextColor={'gray'}
              onChangeText={(value) => {
                setDraft(value)
              }}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.sendBtn}
              onPress={handleSendMsg}
            >
              <Text style={styles.sendText}>SEND</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: 'white'//'rgba(0, 0, 0, 0.2)'
  },
  header: {
    height: '8%',
    width: '100%',
    paddingTop: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'black',
    justifyContent: 'space-between',
  },
  chatSection: {
    width: '100%',
    height: '83%',
    marginTop: '-4%',
    marginBottom: 8,
    backgroundColor: 'white',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  withNameContainer: {
    backgroundColor: 'white'
  },
  peerMessage: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  peerMsgContentHolder: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    maxWidth: windowWidth - 92,
    backgroundColor: '#EEEEEE',
  },
  myMsgContentHolder: {
    borderRadius: 8,
    marginVertical: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#000',
    maxWidth: windowWidth - 82,
  },
  title: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    letterSpacing: 2,
  },
  closeBtn: {
    paddingLeft: 8,
  },
  messageList: {
    paddingBottom: 4,
    paddingHorizontal: 10,
  },
  bottomStack: {
    width: '100%',
    minHeight: '9%',
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  input: {
    padding: 8,
    width: '70%',
    marginBottom: 6,
    // height: '70%',
    borderRadius: 10,
    color: COLOR.black,
    backgroundColor: '#EEEEEE',
  },
  sendBtn: {
    width: 54,
    padding: 4,
    marginBottom: 10,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  addFileBtn: {
    padding: 4,
    marginBottom: 6,
  },
  sendText: {
    color: 'black',
    fontWeight: '500'
  },
  blackText: {
    color: 'black'
  },
  whiteText: {
    color: 'white',
  },
  peerName: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 4,
    marginBottom: 4,
  },
  user_photo: {
    width: 26,
    height: 26,
    marginTop: 16,
    marginRight: 10,
    borderRadius: 13,
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