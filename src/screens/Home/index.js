import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import COLOR from '../../theme'
import Button from '../../components/Button'

const HomeScreen = () => {
  const navigation = useNavigation()

  const navigateMeetingStack = () => {
    navigation.navigate('MyScreen')
  }

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image
          style={styles.logo}
          resizeMode='contain'
          source={require('../../assets/images/Logo.png')}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          height={44}
          width={'80%'}
          hasBlackBg={true}
          title={'New meeting'}
          onPress={navigateMeetingStack}
        />

        <Button
          height={44}
          width={'80%'}
          hasBlackBg={false}
          title={'Join a meeting'}
          onPress={navigateMeetingStack}
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
