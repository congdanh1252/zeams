import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { View, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import COLOR from '../../theme'
import { VISUAL_IMG } from '../../assets'
import Button from '../../components/Button'
import { generateRoomId, mmkv } from '../../utils'
import { setUserId } from '../../redux/slices/AuthenticationSlice'

const HomeScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const navigateMeetingStack = (action) => {
    navigation.navigate('MeetingStack', {
      params: {
        action: action,
        roomId: action == 'create' ? generateRoomId() : null
      },
      screen: action == 'join' ? 'EnterCode' : 'JoinMeeting'
    })
  }

  // gen userId
  useEffect(() => {
    const savedName = mmkv.getString('USER_NAME')

    dispatch(
      setUserId({
        userId: savedName ? savedName : generateRoomId()
      })
    )
  }, [])

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode='contain'
        source={VISUAL_IMG}
      />

      <View style={styles.buttons}>
        <Button
          height={46}
          width={'80%'}
          hasBlackBg={true}
          title={'New meeting'}
          onPress={() => navigateMeetingStack('create')}
        />

        <Button
          height={46}
          width={'80%'}
          hasBlackBg={false}
          title={'Join a meeting'}
          onPress={() => navigateMeetingStack('join')}
        />
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.white,
  },
  logo: {
    width: '92%',
    height: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    width: '100%',
    height: '16%',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
