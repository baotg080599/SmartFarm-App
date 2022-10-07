import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from "react-native";
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { HStack, VStack } from '@react-native-material/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs';
import { getDatabase, ref, set } from 'firebase/database';
import myApp from '../firebase';

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

const ModalPickerMethod = ({ setChange, value, setModalVisible, modalVisible }) => {

  const [listSpraying,setListSpraying] = useState([{name:'None'}]);

  const getItemObject = async (keyObject) => {
    try {
      const jsonValue = await AsyncStorage.getItem(keyObject);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // read error
    }
  };

  useEffect(() => {
    const loadSprayingWay = async () => {
      await getAllKeys();
    }
    loadSprayingWay();
  },[]);

  const getAllKeys = async () => {
    let list = [];
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      list = await Promise.all(keys.map(async value=>{
        const item = await getItemObject(value);
        return{...item,key: value};
      }));
      setListSpraying([...list,{...list[0],name:'None'}]);
    } catch(e) {
      // read key error
    }
  };

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
              renderItem={(data,index) => {
                return (<Text>{data.name}</Text>)
              }}
              onValueChange={(data, selectedIndex) => {
                setChange(state => data);
              }}
              dataSource={listSpraying}
              selectedIndex={0}
              wrapperHeight={180}
              wrapperColor='#FFFFFF'
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}/>
            </View>
          </View>
        </Modal>
  );
}

const PickerTimeScreen = ({ route, navigation }) => {
  const { dateString } = route.params != null ? route.params : {dateString: null};
  const [modalSelectTimeVisible,setModalSelectTimeVisible] = useState(false);
  const [modalSprayingMethod,setModalSprayingMethod] = useState(false);
  const [SelectTimeText,setSelectTimeText] = useState('00:00:00');
  const [sprayingMethod,setPrayingMethod] = useState({name: 'None'});
  const [everyDayValue,setEveryDayValue] = useState(false);
  const [everyWeekValue,setEveryWeekValue] = useState(false);

  const setData = (key, value, status) => {
    const db = getDatabase(myApp);
    const reference = ref(db, '/calendarSpraying/'+key+'/'+value+'/');
    set(reference, status);
  }

  const timeToSecond = (time) => {
    return (parseInt(time.split(':')[0]) * 60 * 60)+ (parseInt(time.split(':')[1])*60) + parseInt(time.split(':')[2]);
  }

  const timeToDate = (time) => {
    return time.get('year')+'-'+(time.get('month')+1).toString().padStart(2,'0')+'-'+time.get('date').toString().padStart(2,'0');
  }

  const timeToTime = (time) => {
    return time.get('hour').toString().padStart(2,'0')+':'+time.get('minute').toString().padStart(2,'0')+':'+time.get('second').toString().padStart(2,'0');
  }

  const setEveryDay = (cycle,dateString,timeStart,sprayingSecond,distanceSecond,key) => {
    let Time = dayjs(dateString+'T'+timeStart).locale('vi');
    setData(dateString+'/timeList',timeStart,key);
    for(let i = 1;i <= cycle;i++){
      setData(timeToDate(Time),timeToTime(Time),1);
      Time = Time.add(sprayingSecond,'second');
      setData(timeToDate(Time),timeToTime(Time),2);
      Time = Time.add(distanceSecond,'second');
    }
  }
 
  const initSpraying = (sprayingMethod, timeStart, dateString,everyDay=1,everyWeek=1) => {
    const {cycle, distanceTime, name, sprayingTime, key} = sprayingMethod;
    const sprayingSecond = timeToSecond(sprayingTime);
    const distanceSecond = timeToSecond(distanceTime);
    let date = dayjs(dateString);
    for(let i = 1;i <= everyDay;i++){
      setEveryDay(cycle,timeToDate(date),timeStart,sprayingSecond,distanceSecond,key);
      date = date.add(everyWeek,'day');
    }
  }

  const getItemObject = async (keyObject) => {
    try {
      const jsonValue = await AsyncStorage.getItem(keyObject);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // read error
    }
  };

    return (
      <View style={styles.centeredView}>
        <ModalPicker modalVisible={modalSelectTimeVisible} setModalVisible={setModalSelectTimeVisible} setChange={setSelectTimeText} value={SelectTimeText}/>
        <ModalPickerMethod value={sprayingMethod} modalVisible={modalSprayingMethod} setModalVisible={setModalSprayingMethod} setChange={setPrayingMethod}/>
        <VStack spacing={'20%'}>
        <HStack spacing={'5%'} style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontWeight: "bold", fontSize:28 }}>Time:</Text>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalSelectTimeVisible(true)}
        >
          <Text style={{...styles.textStyle,fontSize:50}}>{SelectTimeText}</Text>
        </Pressable>
        </HStack>
        <HStack spacing={'5%'} style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontWeight: "bold", fontSize:25 }}>Spraying:</Text>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalSprayingMethod(true)}
        >
          <Text style={{...styles.textStyle,fontSize:40}}>{sprayingMethod.name}</Text>
        </Pressable>
        </HStack>

        <HStack spacing={'5%'} style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>

        <HStack spacing={'5%'} style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontWeight: "bold", fontSize:20 }}>everyDay:</Text>
        <Pressable
          style={[styles.button, {backgroundColor:'white'}]}
          onPress={() => {
            setEveryDayValue(!everyDayValue);
            setEveryWeekValue(false);
          }}
        >
        <Ionicons name={everyDayValue?'checkmark-circle':'checkmark-circle-outline'} size={30} color="#2196F3"/>
        </Pressable>
        </HStack>

        <HStack spacing={'5%'} style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontWeight: "bold", fontSize:20 }}>everyWeek:</Text>
        <Pressable
          style={[styles.button, {backgroundColor:'white'}]}
          onPress={() => {
            setEveryWeekValue(!everyWeekValue);
            setEveryDayValue(false);
          }}
        >
        <Ionicons name={everyWeekValue?'checkmark-circle':'checkmark-circle-outline'} size={30} color="#2196F3"/>
        </Pressable>
        </HStack>
        </HStack>
        <HStack justify='center'>
        <Pressable
          style={{...styles.button, borderRadius:12,...styles.buttonOpen}}
          onPress={() => {
            if(sprayingMethod.cycle != null){
            initSpraying(sprayingMethod,SelectTimeText,dateString,everyDayValue?30:everyWeekValue?30:1,everyWeekValue?7:1);
            navigation.navigate('timeListScreen',{dateString: dateString});
            }
          }}
        >
          <Text style={{...styles.textStyle,fontSize:32}}>Finish</Text>
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

export default PickerTimeScreen;