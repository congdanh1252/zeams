import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { MainScreen } from '../screens/Meeting/MainScreen'
import { EnterCode, JoinMeeting } from '../screens/Meeting/Ready'

const Stack = createNativeStackNavigator()

const MeetingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        orientation: 'portrait',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="EnterCode"
        component={EnterCode}
        options={{headerShown: false, orientation: 'portrait'}}
      />
      <Stack.Screen
        name="JoinMeeting"
        component={JoinMeeting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MeetingScreen"
        component={MainScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

export default MeetingStack
