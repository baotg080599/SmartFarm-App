import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback } from "react-native";
import { IconButton } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { getDatabase, ref, get,remove } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import myApp from '../firebase';
import dayjs from 'dayjs';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    backgroundColor: '#1F9AD8',
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

const TimeListScreen = ({ navigation, route }) => {

  const [timeList, setTimeList] = useState([]);

  const { dateString } = route.params != null ? route.params : {dateString: null};

  const removeData = async (key, value) => {
    const db = getDatabase(myApp);
    const reference = ref(db, '/calendarSpraying/'+key+'/'+value+'/');
    await remove(reference);
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

  const removeTimeList = async(timeStart,key) => {
    const db = getDatabase(myApp);
    const reference = ref(db, '/calendarSpraying/'+key+'/timeList/'+timeStart+'/');
    remove(reference);
  }

  const removeItem = async(cycle,dateString,timeStart,sprayingSecond,distanceSecond,key) => {
    let Time = dayjs(dateString+'T'+timeStart).locale('vi');
    await removeTimeList(timeStart,dateString);
    console.log(dateString);
    for(let i = 1;i <= cycle;i++){
      await removeData(timeToDate(Time),timeToTime(Time));
      Time = Time.add(sprayingSecond,'second');
      await removeData(timeToDate(Time),timeToTime(Time));
      Time = Time.add(distanceSecond,'second');
    }
  }

  const deleteSpraying = async (sprayingMethod,timeStart) => {
    const {cycle, distanceTime, name, sprayingTime, key} = sprayingMethod;
    const sprayingSecond = timeToSecond(sprayingTime);
    const distanceSecond = timeToSecond(distanceTime);
    const date = dayjs(dateString);
    removeItem(cycle,timeToDate(date),timeStart,sprayingSecond,distanceSecond,key);
  };

  const getItemObject = async (keyObject) => {
    try {
      const jsonValue = await AsyncStorage.getItem(keyObject);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // read error
    }
  };

  const getDataDate = async (key) => {
    const db = getDatabase(myApp);
    const reference = ref(db, '/calendarSpraying/');
    const calendarRef = await get(reference);
    if(calendarRef.hasChild(key)){
      const child = calendarRef.child(key+'/timeList/');
      const data = Object.keys(child.toJSON()).map(x => ({ key: x,keyItem: calendarRef.child(key+'/timeList/'+x+'/').toJSON()}));
      setTimeList([ ...data]);
    }
  }

  useEffect(() => {
    const getData = async () => {
      await getDataDate(dateString);
    }
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={timeList}
        renderItem={({ item }) =>
        (
          <TouchableWithoutFeedback onPress={() => navigation.navigate("setupTime",{
            dateString: dateString
          })} key={item.key}>
            <View style={styles.item}>
              <Text style={{ fontSize: 24 }}>{item.key}</Text>
              <IconButton
        style={{alignSelf:'flex-end',marginTop:-40}}
          onPress={async () => {
            const sprayingMethod = await getItemObject(item.keyItem);
            deleteSpraying(sprayingMethod,item.key);
          }}
          icon={(props) => <Icon name='delete' size={30} color='#ffffff'/>}
        />
            </View>
          </TouchableWithoutFeedback>)
        }
      />
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
        onPress={() => navigation.navigate('setupTime',{
            dateString:dateString
         }) } 
            icon={(props) => <Icon 
            name='plus' 
            size={30} 
            color='white'
        />}/>
    </View>
  );
};

export default TimeListScreen;