import React from "react"
import { Text, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import COLOR from "../theme"
import CallScreen from "../screens/Call"

const Tab = createBottomTabNavigator()

const SettingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}

const BottomTabs = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Home') {
              iconName = 'home-outline'
            } else if (route.name === 'Settings') {
              iconName = 'cog-outline'
            } else if (route.name === 'Schedules') {
              iconName = 'calendar-outline'
            }

            return <Ionicons name={iconName} size={22} color={focused ? COLOR.white : '#444444'} />
          },
          tabBarStyle: {
            elevation: 0,
            borderTopWidth: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: COLOR.black
          },
          tabBarShowLabel: false
        })}
      >
        <Tab.Screen name="Home" component={CallScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Schedules" component={SettingScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Settings" component={SettingScreen} options={{headerShown: false}}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default BottomTabs