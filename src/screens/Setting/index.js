import React, { useState } from "react"
import { useSelector } from "react-redux"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

import { USER_ICON } from "../../assets"
import Button from "../../components/Button"
import { windowWidth } from "../../constants"
import { mmkv, showToastAndroid } from "../../utils"
import { selectUserId } from "../../redux/slices/AuthenticationSlice"

export const SettingScreen = () => {
  const currentName = useSelector(selectUserId)
  const [editingName, setEditingName] = useState(false)

  const toggleEditing = () => {
    setEditingName(!editingName)
  }

  const NameAndInput = () => {
    const [newName, setNewName] = useState(currentName)

    const saveNewName = () => {
      if (newName && newName != currentName) {
        mmkv.set('USER_NAME', newName)
        toggleEditing()
        showToastAndroid('Zeams has saved your new name!')
      }
    }

    return (
      <View style={styles.nameSection}>
        {
          !editingName ? (
            <Text numberOfLines={1} style={styles.blackText}>{currentName}</Text>
          ) : (
            <TextInput
              value={newName}
              multiline={false}
              numberOfLines={1}
              placeholder="ABCDEF"
              style={styles.input}
              onChangeText={(val) => {
                setNewName(val)
              }}
              placeholderTextColor={'gray'}
            />
          )
        }

        {/* Open/Cancel */}
        <Pressable
          style={({ pressed }) => [
            styles.editBtn, {
              backgroundColor: pressed ? 'black' : 'white'
            }
          ]}
          onPress={() => {
            toggleEditing()
            if (editingName) {
              setNewName(currentName)
            }
          }}
        >
          {({ pressed }) => (
            <Ionicons name={editingName ? "close-outline" : "create-outline"} size={20} color={pressed ? 'white' : 'black'}/>
          )}
        </Pressable>

        {/* Save change */}
        {
          editingName ? (
            <Pressable
              style={({ pressed }) => [
                styles.editBtn, {
                  backgroundColor: pressed ? 'black' : 'white'
                }
              ]}
              onPress={saveNewName}
            >
              {({ pressed }) => (
                <Ionicons name="checkmark-outline" size={20} color={pressed ? 'white' : 'black'}/>
              )}
            </Pressable>
          ) : null
        }
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Image
          resizeMode="cover"
          style={styles.avatar}
          source={USER_ICON}
        />

        <NameAndInput />
      </View>

      <View style={styles.signInBtn}>
        <Button
          height={40}
          width={'70%'}
          title={'SIGN IN'}
          hasBlackBg={true}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  infoBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    marginBottom: 12,
    width: windowWidth * 0.25,
    height: windowWidth * 0.25,
    borderRadius: (windowWidth * 0.25) / 2
  },
  nameSection: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    width: 36,
    height: 36,
    marginLeft: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  blackText: {
    fontSize: 16,
    color: 'black',
    maxWidth: '80%',
    fontWeight: '600'
  },
  signInBtn: {
    width: '100%',
    marginTop: 36,
    alignItems: 'center'
  },
  input: {
    height: 36,
    width: '60%',
    color: 'black',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.08)'
  }
})