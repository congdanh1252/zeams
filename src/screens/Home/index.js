import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import COLOR from '../../theme'
import { VISUAL_IMG } from '../../assets'
import Button from '../../components/Button'

const HomeScreen = () => {
  const navigation = useNavigation()

  const navigateMeetingStack = (action) => {
    navigation.navigate('MeetingStack', {
      params: {
        action: action
      },
      screen: action == 'join' ? 'EnterCode' : 'JoinMeeting'
    })
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode='contain'
        source={VISUAL_IMG}
      />

      <View style={styles.buttons}>
        <Button
          height={44}
          width={'80%'}
          hasBlackBg={true}
          title={'New meeting'}
          onPress={() => navigateMeetingStack('create')}
        />
        {/*
          create roomId -> navigate ready screen
          -> join -> send 'create' message to server -> server let socket join 'roomId'
          -> exit -> end

          another user enter code -> check roomId on server
          -> exist -> let user in ready screen
          -> join -> send 'join' message to server -> server let socket join 'roomId'

          creator in room -> waiting for new one join room
          -> new one send offer -> everyone in room listen and create new peerConnection
          -> exchange offer/answer
        */}

        <Button
          height={44}
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
