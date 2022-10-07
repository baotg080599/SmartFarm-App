import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/MaterialCommunityIcons';
import Icons from '@expo/vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen';
import SprayingMethod from './screens/SprayingMethod';
import CalendarScreen from './screens/CalendarScreen';
import SettingScreen from './screens/SettingScreen';

const App = () => {
  const Tab = createBottomTabNavigator();
  return(
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'home-thermometer'
                : 'home-thermometer-outline';
            } else 
            if (route.name === 'SprayingMethod') {
              iconName = focused 
              ? 'watering-can' 
              : 'watering-can-outline';
            } else 
            if (route.name === 'Calendar') {
              iconName = focused 
              ? 'calendar-month' 
              : 'calendar-month-outline';
            }else 
            if (route.name === 'Setting') {
              iconName = focused 
              ? 'settings-sharp' 
              : 'settings-outline';
              return <Icons name={iconName} size={32} color={color}/>
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={35} color={color} />;
          },
          
          showLabel: false,
          // headerShown:false,
          tabBarShowLabel:false,
          tabBarStyle: { 
            position: 'absolute',
            bottom: 30,
            left: 20,
            right: 20,
            shadowColor: '#000',
            shadowOffset: { width: 50, height: 50 },
            shadowOpacity: 1.5,
            shadowRadius: 15,
            elevation: 1,
            backgroundColor: 'white',
            borderRadius: 20,
            height: 80,
          },
        })}
        >
          <Tab.Screen name='Home' component={HomeScreen} />
          <Tab.Screen name='Calendar' component={CalendarScreen}/>
          <Tab.Screen options={{headerShown:false}} name='SprayingMethod' component={SprayingMethod} />
          <Tab.Screen name='Setting' component={SettingScreen}/>
        </Tab.Navigator>
      </NavigationContainer>
  );
}

export default App;

