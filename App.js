import React from 'react'
import { Provider } from 'react-redux'
import { useNetInfo } from '@react-native-community/netinfo'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { store } from './src/redux/store'
import MainStack from './src/navigation/MainStack'
import NetworkModal from './src/components/NetworkModal'

const App = () => {
  const connected = useNetInfo().isConnected

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.full}>
        <SafeAreaView style={styles.full}>
          <StatusBar
            translucent
            barStyle={'light-content'}
            backgroundColor={'black'}
          />
          
          <MainStack />

          {
            !connected && <NetworkModal />
          }
        </SafeAreaView>
      </GestureHandlerRootView>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({
  full: {
    flex: 1
  }
})