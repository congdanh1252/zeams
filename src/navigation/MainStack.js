import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, Text } from 'react-native'

import COLOR from '../theme'
import BottomTabs from './BottomTabs'
import { MainScreen } from '../screens/Meeting'

const Stack = createNativeStackNavigator()

const MyScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR.primary}}>
      <Text style={{color: '#fff'}}>MyScreen</Text>
    </View>
  )
}

const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="HomeStack" component={BottomTabs} options={{headerShown: false}}/>
        <Stack.Screen name="MyScreen" component={MainScreen} options={{headerShown: false, orientation: 'portrait'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStack