import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, TouchableWithoutFeedback, Modal } from 'react-native';
import { Calendar, LocaleConfig} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import myApp from '../firebase';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { createStackNavigator } from '@react-navigation/stack';
import PickerTimeScreen from './PickerTimeScreen';
import TimeListScreen from './timeListScreen';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
   paddingTop: 22
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

const CalendarComponent = ({ navigation }) => {
  const [timeValue,setTimeValue] = useState('');
  const [markDateList,setMarkDateList] = useState({});
 
  const getAllData = async () => {
    const db = getDatabase(myApp);
    const reference = ref(db, '/calendarSpraying');
    const dateList = (await get(reference)).toJSON();
    Object.keys(dateList).forEach(key => dateList[key] = {selected: true, selectedColor: 'blue'});
    setMarkDateList(state => dateList);
  }

  const listenValue = async () => {
    const db = getDatabase();
    const reference = ref(db, '/');
    onValue(reference,(snapshot) => {
      let listSprayingTimeDate = snapshot.val().calendarSpraying;
      console.log(listSprayingTimeDate);
    });
  }

  const setData = async (key,value) => {
    const db = getDatabase(myApp);
    const reference = ref(db,'/' + key);
    set(reference,value);
  }

  useEffect(() => {
    const loadAllDate = async () => {
      await getAllData();
    }
    loadAllDate();
  });
  var currentdate = new Date();

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
      keys.forEach(async element => {
        let item = await getItemObject(element);
        list.push({...item,key: element});
        setListSpraying(list);
      });
    } catch(e) {
      // read key error
    }
  };

  return(
      <Calendar
        markedDates = {
          markDateList
        }
        minDate={currentdate.getFullYear()+'-'+(currentdate.getMonth()+1).toString().padStart(2, '0')+'-'+currentdate.getDate().toString().padStart(2, '0')}
        onDayPress={day => {
          navigation.navigate('timeListScreen',{dateString:day.dateString});
        }}
        onDayLongPress={day => {
          console.log('selected day', day);
        }}
        monthFormat={'MM-yyyy'}
        onMonthChange={month => {
          console.log('month changed', month);
        }}
        disableMonthChange={true}
        hideExtraDays={true}
        firstDay={1}
        onPressArrowLeft={subtractMonth => subtractMonth()}
        onPressArrowRight={addMonth => addMonth()}
        disableAllTouchEventsForDisabledDays={true}
        enableSwipeMonths={true}
      />
  );
};

const CalendarScreen = () => {
  return(
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="calendar"
        component={CalendarComponent}
      />

      <Stack.Screen
        name="setupTime"
        component={PickerTimeScreen}
      />

      <Stack.Screen
      name="timeListScreen"
      component={TimeListScreen}
      />
    </Stack.Navigator>
  );
};

export default CalendarScreen;

