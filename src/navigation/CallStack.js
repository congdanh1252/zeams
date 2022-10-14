import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import EnterCode from '../screens/Call/EnterCode'
import CallScreen from '../screens/Call'
import JoinMeeting from '../screens/Call/JoinMeeting'

const Stack = createNativeStackNavigator()

const CallStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="Call"
        component={CallScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EnterCode"
        component={EnterCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JoinMeeting"
        component={JoinMeeting}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

export default CallStack
