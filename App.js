import React from 'react'
import { Provider } from 'react-redux'
import { SafeAreaView, StatusBar } from 'react-native'

import { store } from './src/redux/store'
import MainStack from './src/navigation/MainStack'
import { MainScreen } from './src/screens/Meeting/MainScreen'

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          translucent
          barStyle={'light-content'}
          backgroundColor={'black'}
        />
        
        <MainStack />
        {/* <MainScreen /> */}
      </SafeAreaView>
    </Provider>
  )
}

export default App