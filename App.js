import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

import MainStack from './src/navigation/MainStack'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'black'}
      />
      
      <MainStack />
    </SafeAreaView>
  )
}

export default App