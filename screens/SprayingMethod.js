import React, { useState } from 'react';
import { IconButton } from "@react-native-material/core";
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList, StyleSheet, Text, View, TouchableWithoutFeedback  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import SprayingScreen from './sprayingScreen';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    backgroundColor: '#008EDA',
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

const List = ({ navigation, route }) => {
  const [listSpraying,setListSpraying] = useState([]);

  const getItemObject = async (keyObject) => {
    try {
      const jsonValue = await AsyncStorage.getItem(keyObject);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // read error
    }
  };

 const getAllKeys = async () => {
    let list = [];
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      list = await Promise.all(keys.map(async value=>{
        return ({...await getItemObject(value),key: value})
      }));
      setListSpraying(state => [...list]);
    } catch(e) {
      // read key error
    }
  };

  const removeItem = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch(exception) {
        return false;
    }
  }

  React.useEffect(() => {
    const load = async () =>{
      return await getAllKeys();  
    }
    load();
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          onPress={async () => await getAllKeys()}
          icon={(props) => <Icon name='reload' size={30}/>}
        />
      )
    });
  }, [navigation]);
  
  return(
  <View style={styles.container}>
    {listSpraying.length === 0 && <Text style={{alignSelf:'center'}}>add spraying way</Text>}
    {listSpraying.length > 0 &&
    <FlatList
      data={listSpraying}
      renderItem={({item}) =>
      <TouchableWithoutFeedback onPress={ () => {
        navigation.navigate('spraying',{
        key: item.key
      })}}>
      <View style={styles.item}>
        <Text style={{fontSize: 24, color:'#ffffff'}}>
          {item.name}
        </Text>
        <IconButton
        style={{alignSelf:'flex-end',marginTop:-40}}
          onPress={async () => {
            removeItem(item.key);
            getAllKeys();
          }}
          icon={(props) => <Icon name='delete' size={30} color='#ffffff'/>}
        />
      </View>
      </TouchableWithoutFeedback>
      }
    />}
    <IconButton style={{
      position:'absolute',
      alignSelf:'flex-end',
      bottom:120,
      right:20,
      borderRadius:30,
      backgroundColor:'#1BCA50',
      padding:28,shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      }
    }} 
    onPress={() => navigation.navigate('spraying') } 
    icon={(props) => <Icon 
    name='plus' 
    size={30} color='white'/>}></IconButton>
  </View>);
};

const SprayingMethod = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Settings"
        component={List}
      />
      <Stack.Screen
        name="spraying"
        component={SprayingScreen}

      />
    </Stack.Navigator>
  );
};

export default SprayingMethod;