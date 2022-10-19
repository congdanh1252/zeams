import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BottomTabs from './BottomTabs'
import MeetingStack from './MeetingStack'

const Stack = createNativeStackNavigator()

const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          orientation: 'portrait',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="HomeStack" component={BottomTabs} options={{headerShown: false}}/>
        <Stack.Screen name="MeetingStack" component={MeetingStack} options={{headerShown: false, orientation: 'portrait'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStack