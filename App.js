import React from 'react'
import { Provider } from 'react-redux'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { store } from './src/redux/store'
import MainStack from './src/navigation/MainStack'
import { Temp } from './src/screens/Meeting/MainScreen/Temp'

const App = () => {
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
          {/* <Temp /> */}
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