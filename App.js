import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

import MainStack from './src/navigation/MainStack'
import { MainScreen } from './src/screens/Meeting/MainScreen'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'black'}
      />
      
      <MainStack />
      {/* <MainScreen /> */}
    </SafeAreaView>
  )
}

export default App