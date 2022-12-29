import RNFS from 'react-native-fs'
import { useSelector } from "react-redux"
import ImageView from "react-native-image-viewing"
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useMemo, useRef, useState, useEffect } from "react"
import DocumentPicker, { types } from 'react-native-document-picker'
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { ActivityIndicator, Alert, Image, PermissionsAndroid, StyleSheet, Text, TextInput, TouchableHighlight,
  TouchableOpacity, View
} from "react-native"

import COLOR from "../../../theme"
import { Empty } from '../../../components/Empty'
import { DOC_ICON, PDF_ICON, USER_ICON } from '../../../assets'
import { showToastAndroid, handleError } from '../../../utils'
import { selectUserId } from "../../../redux/slices/AuthenticationSlice"
import { selectChatMessages } from "../../../redux/slices/ConnectionSlice"
import { statusBarHeight, windowHeight, windowWidth } from "../../../constants"

const EmptyView = () => {
  const EMPTY_MSG = 'Start to chat now by sending first message! 👋'

  return (
    <>
      <Text style={styles.noticeText}>(Chat in call will not be saved)</Text>

      <Empty message={EMPTY_MSG} upSideDown={true}/>
    </>
  )
}

export const ChatBox = ({ roomId, closeCallback, sendMsgCallback }) => {
  const sheetRef = useRef(null)
  const [draft, setDraft] = useState('')
  const userId = useSelector(selectUserId)
  const [viewImg, setViewImg] = useState('')
  const [file, setFile] = useState(undefined)
  const chatMessages = useSelector(selectChatMessages)
  const [isUploading, setIsUploading] = useState(false)

  const snapPoints = useMemo(() => ["100%"], [])

  const toggleImageViewer = (img = '') => {
    setViewImg(img)
  }

  const getFileType = (type) => {
    let res
    if (type.includes('image')) {
      res = 'image'
    } else if (type.includes('pdf')) {
      res = 'pdf'
    } else {
      res = 'doc'
    }

    return res
  }

  const downloadFile = (url, fileName) => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    .then(res => {
      if (res == 'granted') {
        console.log('Starting to download file...')
        showToastAndroid('Starting to download file...')

        RNFS.downloadFile({
          fromUrl: url,
          toFile: `${RNFS.DownloadDirectoryPath}/${fileName}`,
        })
        .promise
        .then((result) => {
          showToastAndroid(`Download ${fileName} completed!`)
        })
        .catch((err) => {
          handleError()
          console.log(err)
        })
      } else {
        showToastAndroid('Cannot perform action without permission!')
      }
    })
  }

  // message with file as content
  const FileContent = React.memo(({ item }) => {
    const isMyMessage = item.sender == userId

    const handleContentPress = () => {
      if (item.contentType == 'text') {
        return
      }
      if (isMyMessage) {
        if (item.contentType == 'image') {
          toggleImageViewer(item.content)
        }
      } else {
        if (item.contentType == 'image') {
          toggleImageViewer(item.content)
        } else {
          downloadFile(item.content, item.fileName)
        }
      }
    }

    return (
      <TouchableHighlight
        onPress={handleContentPress}
        underlayColor={isMyMessage ? 'transparent' : 'gray'}
      >
        <View style={styles.fileInMyMsgHolder}>
          <Image
            resizeMode='contain'
            source={
              item.contentType == 'image' ? (
                {uri: item.content}
              ) : (
                item.contentType == 'pdf' ? PDF_ICON : DOC_ICON
              )
            }
            style={item.contentType == 'image' ? styles.pickedPhoto : styles.pickedDocImg}
          />

          {
            (item.contentType == 'image') ? null : (
              <Text
                numberOfLines={2}
                style={isMyMessage ? styles.whiteText : styles.blackText}
              >
                {item.fileName}
              </Text>
            )
          }
        </View>
      </TouchableHighlight>
    )
  })

  // single chat message
  const renderItem = ({ item }) => {
    return (
      item.sender == userId ? (
        <View style={styles.myMsgContentHolder}>
          {
            item.contentType == 'text' ? (
              <Text style={styles.whiteText}>{item.content}</Text>
            ) : (
              <FileContent item={item}/>  
            )
          }
        </View>
      ) : (
        <View style={styles.peerMessage}>
          <Image
            source={USER_ICON}
            style={styles.userPhoto}
          />

          <View style={styles.withNameContainer}>
            <Text style={styles.peerName}>{item.sender}</Text>

            <View style={styles.peerMsgContentHolder}>
              {
                item.contentType == 'text' ? (
                  <Text style={styles.blackText}>{item.content}</Text>
                ) : (
                  <FileContent item={item}/>
                )
              }
            </View>
          </View>
        </View>
      )
    )
  }

  const handleSendMsg = () => {
    if (draft != '') {
      setIsUploading(true)
      sendMsgCallback({
        type: 'chat',
        sender: userId,
        content: draft,
        roomId: roomId,
        contentType: 'text',
        createdAt: new Date().getTime(),
      })
      setDraft('')
    } else {
      setIsUploading(true)
      if (file) {
        getFileAsBase64()
        .then(res => {
          sendMsgCallback({
            type: 'chat',
            sender: userId,
            content: `data:${file.type};base64,` + res,
            roomId: roomId,
            fileName: file.name,
            createdAt: new Date().getTime(),
            contentType: getFileType(file.type),
          })
          console.log('done send file to server')
          setFile(undefined)
        })
        .catch(err => {
          handleError()
          console.log(err)
        })
      }
    }
  }

  const getFileAsBase64 = () => {
    return RNFS.readFile(file?.uri, 'base64')
  }

  const pickFile = () => {
    try {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
      .then((res) => {
        if (res == 'granted') {
          DocumentPicker.pickSingle({
            presentationStyle: 'formSheet',
            type: [types.doc, types.docx, types.pdf, types.images]
          })
          .then(result => {
            console.log(result)
            // maximum file size: 10 MB
            if (result.size <= 10000000) {
              setFile(result)
            } else {
              Alert.alert(
                "Large file alert",
                "Size of image and document must not be greater than 10 MB!",
                [
                  { text: "OK" }
                ]
              )
            }
          })
          .catch(error => {
            handleError()
            console.log(error)
          })
        } else {
          showToastAndroid('Cannot perform action without permission!')
        }
      })
    } catch (error) {
      handleError()
      console.log(error)
    }
  }

  // turn off activity indicator
  useEffect(() => {
    if (isUploading) {
      setIsUploading(false)
    }
  }, [chatMessages])

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
            ListEmptyComponent={EmptyView}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageList}
          />

          <View style={styles.bottomStack}>
            <TouchableOpacity
              onPress={pickFile}
              activeOpacity={0.5}
              style={styles.addFileBtn}
            >
              <Ionicons name="add-circle-outline" color={'black'} size={28}/>
            </TouchableOpacity>

            {/* Input */}
            {
              !file ? (
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
              ) : (
                <View style={styles.pickedPhotoHolder}>
                  {
                    !file?.type.includes("image") ? (
                      <View style={styles.pickedDoc}>
                        <Image
                          resizeMode='contain'
                          style={styles.pickedDocImg}
                          source={file?.type.includes("pdf") ? PDF_ICON : DOC_ICON}
                        />

                        <Text style={styles.blackText}>{file?.name}</Text>
                      </View>
                    ) : (
                      <Image
                        resizeMode='contain'
                        source={{uri: file?.uri}}
                        style={styles.pickedPhoto}
                      />
                    )
                  }

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setFile(undefined)}
                    style={styles.removePhotoButton}
                  >
                    <Text style={{color: '#fff', fontSize: 20}}> —</Text>
                  </TouchableOpacity>
                </View>
              )
            }

            {/* Send button */}
            {
              isUploading ? (
                <ActivityIndicator
                  size={20}
                  color={'black'}
                  style={{marginBottom: 16, marginRight: 4}}
                />
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.sendBtn}
                  onPress={handleSendMsg}
                >
                  <Text style={styles.sendText}>SEND</Text>
                </TouchableOpacity>
              )
            }
          </View>
        </View>
      </BottomSheet>

      {/* Image in Chat Viewer */}
      <ImageView
        imageIndex={0}
        images={[{uri: viewImg}]}
        keyExtractor={(img) => img.uri}
        presentationStyle={'fullScreen'}
        onRequestClose={toggleImageViewer}
        visible={viewImg != '' ? true : false}
      />
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
    flexDirection: 'row',
    paddingHorizontal: 12,
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
    marginVertical: 5,
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
    marginVertical: 5,
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
    letterSpacing: 2,
    fontWeight: '500',
  },
  noticeText: {
    fontSize: 12,
    transform: [
      {rotate: '180deg'},
      {rotateY: '180deg'}
    ],
    fontStyle: 'italic',
    textAlign: 'center',
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
    paddingHorizontal: 12,
    alignItems: 'flex-end',
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
  userPhoto: {
    width: 26,
    height: 26,
    marginTop: 16,
    marginRight: 10,
    borderRadius: 13,
  },
  pickedDoc: {
    width: '90%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pickedDocImg: {
    width: '80%',
    height: '70%',
  },
  pickedPhoto: {
    width: '90%',
    height: '100%',
    borderRadius: 10
  },
  pickedPhotoHolder: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    height: windowHeight / 4,
    width: windowWidth - 148,
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
  },
  fileInMyMsgHolder: {
    alignItems: 'center',
    height: windowHeight / 6,
    width: windowWidth / 2,
    justifyContent: 'space-between',
  },
  removePhotoButton : {
    top: 4,
    right: 14,
    width: 26,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
    backgroundColor: COLOR.black
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