import { View, Button, TextInput } from 'react-native';
import React from 'react';

const SetupWifiComponent = () => {
  return (
    <View style={{
      height:200
    }}>
      <View>
      <TextInput 
        style={{
          width: 250,
          height:44,
          backgroundColor: '#f1f3f6',
          borderRadius: 6,
          paddingHorizontal: 10,
        }}
        placeholder='SSID'
      /></View>
      <View>
      <TextInput 
        style={{
          width: 250,
          height:44,
          backgroundColor: '#f1f3f6',
          borderRadius: 6,
          top:18,
          paddingHorizontal: 10
        }}
        placeholder='PASSWORD'
      />
    </View>
    <View style={{
      top:30
    }}>
      <Button title='Connect'/>
    </View>
    </View>
  )
}

export default SetupWifiComponent