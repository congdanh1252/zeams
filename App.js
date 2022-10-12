import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

import BottomTabs from './src/navigation/BottomTabs'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
      />
      
      <BottomTabs />
    </SafeAreaView>
  )
}

export default App