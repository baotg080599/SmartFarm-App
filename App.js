import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen';
import SprayingMethod from './screens/SprayingMethod';
import CalendarScreen from './screens/CalendarScreen';

const App = () => {
  const Tab = createBottomTabNavigator();
  return(
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'home-sharp'
                : 'home-outline';
            } else 
            if (route.name === 'Setting') {
              iconName = focused 
              ? 'md-settings-sharp' 
              : 'md-settings-outline';
            } else 
            if (route.name === 'Calendar') {
              iconName = focused 
              ? 'calendar-sharp' 
              : 'calendar-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          showLabel: false,
          // headerShown:false,
          tabBarStyle: { 
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: 'white',
            borderRadius: 15,
            height: 70,
          }
        })}
        >
          <Tab.Screen name='Home' component={HomeScreen} />
          <Tab.Screen name='Calendar' component={CalendarScreen}/>
          <Tab.Screen options={{headerShown:false}} name='Setting' component={SprayingMethod} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}

export default App;

