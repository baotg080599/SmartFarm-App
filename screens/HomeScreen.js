import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import FarmModal from '../components/FarmModal';
import { HStack } from '@react-native-material/core';

const styles = StyleSheet.create({
  container: {
   paddingTop: 22
  },
  item: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 50, height: 50 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 3
  }
});

const HomeScreen = () => {
  const [FarmModalVisible,setFarmModalVisible] = useState(false);

  
  return (
    <View>
      <FlatList
        data={[
          {key: 'Farm 1',image:require('../assets/farm1.jpg')},
          {key: 'Farm 2',image:require('../assets/farm2.jpg')}
        ]}
        renderItem={({item}) => {
        return (
        <TouchableWithoutFeedback onPress={()=> setFarmModalVisible(true)}>
        <View style={styles.item} >
        <Image style={{width:90,height:90,borderRadius:50}} source={item.image}/>
        <View style={{
          flex:1,
          flexDirection:'column',
          alignItems:'flex-start'
        }}>
            <View style={{
              flex:1,
              flexDirection:'row',
              alignItems:'flex-start'
            }}>
              <View style={{
                flex:1.5,
                flexDirection:'column',
                paddingLeft:30,
                alignItems:'flex-start',
                justifyContent:'space-between'
                }}>
                  <Text style={{fontWeight:'bold', fontSize:20}}> {item.key} </Text>
                  <Text> Humidity: 50% </Text>
                  <Text> Light: 30% </Text>
                  <Text> Water: 40% </Text>
              </View>
              <View style={{
                    padding:10, 
                    borderColor:'#37CEF0',
                    borderRadius: 30,
                    borderWidth: 1,
                    top: 20
                    }}>
                      <Icon name="water" size={30} color="#37CEF0" />
              </View>
            </View>
            <HStack 
            style={{
              paddingLeft:30
            }}
            m={1} 
            spacing={2}>
              {
                ['MON','TUE','WED','THU','FRI','SAT','SUN'].map(element => (
                  <View key={element} style={{
                    borderWidth:2,
                    borderColor:'gray',
                    alignItems:'center',
                    justifyContent:'center',
                    width:27,
                    height:27,
                    margin:2,
                    borderRadius:50
                  }}><Text style={{
                    fontWeight:'bold',
                    color:'gray',
                    fontSize:8
                  }}>{element}</Text></View>
                ))
              }
            </HStack>
          </View>
        </View>
        </TouchableWithoutFeedback>)}
    }
      />
      <FarmModal modalVisible={FarmModalVisible} setModalVisible={setFarmModalVisible}/>
    </View>
  )
}

export default HomeScreen