import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from "react-native";
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { HStack, VStack } from '@react-native-material/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModalPicker = ({ setChange, value, setModalVisible, modalVisible }) => {

  const seconds = [];
  const minutes = [];
  const hours = [];

  for (let index = 0; index < 60; index++) {
    seconds.push(index.toString().padStart(2, '0'));
    minutes.push(index.toString().padStart(2, '0'));
  }

  for (let index = 0; index < 24; index++) {
    hours.push(index.toString().padStart(2, '0'));
  }

  return(
    <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredViewModal}>
            <View style={styles.modalView}>
            <ScrollPicker
              onValueChange={(data, selectedIndex) => {
                setChange(data + ':' + value.substring(3,value.length))
              }}    
              dataSource={hours}
              selectedIndex={parseInt(value.substring(0,3))}
              wrapperHeight={180}
              wrapperColor='#FFFFFF'
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}/>
            <Text>hour</Text>
            <ScrollPicker 
              onValueChange={(data, selectedIndex) => {
                setChange(value.substring(0,3)+ data + value.substring(5,value.length))
              }}
              dataSource={minutes}
              selectedIndex={parseInt(value.substring(3,5))}
              wrapperHeight={180}
              wrapperColor='#FFFFFF'
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}/>
            <Text>minute</Text>
            <ScrollPicker
              onValueChange={(data, selectedIndex) => {
                setChange(value.substring(0,value.length-2)+ data)
              }}
              dataSource={seconds}
              selectedIndex={parseInt(value.substring(6,value.length))}
              wrapperColor='#FFFFFF'
              wrapperHeight={180}
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}/>
            <Text>seconds</Text>
            </View>
          </View>
        </Modal>
  );
}

const SetUpModal = ({ value, navigation, setModalVisible, modalVisible, keyItem }) => {
  const [nameValue, setNameValue] = useState('');
  const [cycleValue, setCycleValue] = useState(0);

  var currentdate = new Date(); 

  const setSpraying = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      if(keyItem!=null){
        await AsyncStorage.mergeItem(keyItem, jsonValue);
      }else{
        await AsyncStorage.setItem(currentdate.toString(), jsonValue);
      }
    } catch(e) {
      // save error
    }
  }

  return(
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
  >
    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
      }}>
      <View style={{
          alignItems: "center",
          flexDirection: 'column',
          backgroundColor: "white",
          borderRadius: 25,
          padding:'10%',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
      }}>
        
      <TextInput
        style={{
          height: 40,
          width: 280,
          margin: 12,
          borderBottomWidth: 1,
          padding: 5
        }}
        onChangeText={newText => setNameValue(newText)}
        defaultValue={nameValue}
        placeholder="name"
      />
      <TextInput
        style={{height: 40,
          width: 280,
          margin: 12,
          borderBottomWidth: 1,
          padding: 5,}}
        onChangeText={newText => setCycleValue(newText)}
        defaultValue={cycleValue}
        placeholder="cycle"
        keyboardType="numeric"
      />
      {<Text></Text>}
      <Pressable
          style={{...styles.button, borderRadius:12,...styles.buttonOpen, alignSelf:'flex-end'}}
          onPress={() => {
            setSpraying({
              name: nameValue,
              sprayingTime: value.spraying,
              distanceTime: value.distance,
              cycle: cycleValue
            });
            setModalVisible(!modalVisible);
            navigation.navigate('Settings',{ rerenderParam: 0 });
          }}
        >
          <Text style={{...styles.textStyle,fontSize:22}}>Finish</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
  );
};

const SprayingScreen = ({ route,navigation }) => {
  const { key } = route.params != null ? route.params : {key: null};
  const [modalSprayingVisible,setModalSprayingVisible] = useState(false);
  const [modalDistanceVisible,setmodalDistanceVisible] = useState(false);
  const [modalSetupVisible, setModalSetupVisible] = useState(false);
  const [SprayingText,setSprayingText] = useState('00:00:00');
  const [DistanceText,setDistanceText] = useState('00:00:00');
  const[rerender,setRerender] = useState(false);
 
  const getItemObject = async (keyObject) => {
    try {
      const jsonValue = await AsyncStorage.getItem(keyObject);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log(e);
      // read error
    }
  };

  useEffect(() => {
    const loadSpraying = async () => {
      try{
        let spraying = key != null ? await getItemObject(key) : null;
        if(spraying != null){
          let SprayingTime = spraying != null ? spraying.sprayingTime : '00:00:00';
          let DistanceTime = spraying != null ? spraying.distanceTime : '00:00:00';
          setSprayingText(SprayingTime);
          setDistanceText(DistanceTime);
          setRerender(!rerender);
        }
      }catch(e){
        console.log(e);
      }
    }
    if(!rerender && key != null)
    loadSpraying();
  });

    return (
      <View style={styles.centeredView}>
        <ModalPicker modalVisible={modalSprayingVisible} setModalVisible={setModalSprayingVisible} setChange={setSprayingText} value={SprayingText}/>
        <ModalPicker modalVisible={modalDistanceVisible} setModalVisible={setmodalDistanceVisible} setChange={setDistanceText} value={DistanceText}/>
        <SetUpModal value={{spraying:SprayingText,distance:DistanceText}} modalVisible={modalSetupVisible} setModalVisible={setModalSetupVisible} navigation={navigation} keyItem={key}/>
        <VStack spacing={'20%'}>
        <HStack spacing={'5%'} style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontWeight: "bold", fontSize:28 }}>Spraying:</Text>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalSprayingVisible(true)}
        >
          <Text style={{...styles.textStyle,fontSize:50}}>{SprayingText}</Text>
        </Pressable>
        </HStack>
        <HStack spacing={'5%'} style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontWeight: "bold", fontSize:28 }}>Distance:</Text>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setmodalDistanceVisible(true)}
        >
          <Text style={{...styles.textStyle,fontSize:50}}>{DistanceText}</Text>
        </Pressable>
        </HStack>
        <HStack justify='center'>
        <Pressable
          style={{...styles.button, borderRadius:12,...styles.buttonOpen}}
          onPress={() => setModalSetupVisible(true)}
        >
          <Text style={{...styles.textStyle,fontSize:32}}>Next</Text>
        </Pressable>
        </HStack>
        </VStack>
      </View>
    );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 22
  },
  centeredViewModal: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
    marginTop: 22
  },
  modalView: {
    alignItems: "center",
    flexDirection: 'row',
    backgroundColor: "white",
    borderRadius: 25,
    paddingBottom: '20%',
    paddingTop:'15%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: '2%',
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default SprayingScreen;