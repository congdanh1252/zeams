import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import COLOR from '../theme'
import HomeScreen from '../screens/Home'
import { SettingScreen } from '../screens/Setting'
import { SchedulesScreen } from '../screens/Schedule'

const Tab = createBottomTabNavigator()

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName

          if (route.name === 'Home') {
            iconName = 'home-outline'
          } else if (route.name === 'Settings') {
            iconName = 'cog-outline'
          } else if (route.name === 'Schedules') {
            iconName = 'calendar-outline'
          }

          return (
            <Ionicons
              name={iconName}
              size={22}
              color={focused ? COLOR.white : '#444444'}
            />
          )
        },
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: COLOR.black,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Schedules"
        component={SchedulesScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  )
}

export default BottomTabs
