import { View, FlatList, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import React, {useState} from 'react';
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons';
import EntypoIcon from '@expo/vector-icons/Entypo';
import { Switch } from "@react-native-material/core";

import SprayingByHumidityComponent from '../components/SprayingByHumidityComponent';
import SprayingBySoilHumidityComponent from '../components/SprayingBySoilHumidityComponent';
import SetupWifiComponent from '../components/SetupWifiComponent';
import FeatureModalComponent from '../components/FeatureModalComponent';

const styles = StyleSheet.create({
  container: {
    paddingTop: 22
  },
  item: {
    flex: 1,
    flexDirection:'row',
    paddingVertical:40,
    paddingHorizontal:20,
    justifyContent:'flex-start',
    alignItems:'space-between'
  },
  text:{
    fontSize:20,
    paddingVertical:10,
    paddingLeft:30,
    width:260,
  }
});

const SettingScreen = () => {
  const [FeatureModalVisible,setFeatureModalVisible] = useState(false);
  const [childComponent,setChildComponent] = useState(null);
  const [airState,setAirState] = useState(false);
  const [soilSate,setSoilState] = useState(false);
  const [rainState,setRainState] = useState(false);

  const featureNameList = [
    {
      key:1,
      name:'Setup wifi for device',
      icon: <MaterialIcon style={{ justifyContent:'center', alignSelf:'center'}} name='wifi-strength-4' size={35}/>,
      featureComponent: <SetupWifiComponent/>,
      extendComponent: null,
    },
    {
      key:2,
      name:'Spraying by humidity',
      icon: <EntypoIcon style={{ justifyContent:'center', alignSelf:'center'}} name='water' size={35}/>,
      featureComponent: <SprayingByHumidityComponent/>,
      extendComponent: <Switch style={{
        marginLeft:'auto',
        marginRight:0
      }} value={airState} onValueChange={() => setAirState(!airState)}/>
    },
    {
      key:3,
      name:'Spraying by soil humidity',
      icon:<MaterialIcon style={{ justifyContent:'center', alignSelf:'center'}} name='grain' size={35}/>,
      featureComponent: <SprayingBySoilHumidityComponent/>,
      extendComponent: <Switch style={{        
        marginLeft:'auto',
        marginRight:0
    }}value={soilSate} onValueChange={() => setSoilState(!soilSate)}/>
    },
    {
      key:4,
      name:'Stop spraying when rain',
      icon: <MaterialIcon style={{ justifyContent:'center', alignSelf:'center'}} name='weather-rainy' size={35}/>,
      extendComponent: <Switch style={{
        marginLeft:'auto',
        marginRight:0,
        justifyContent:'center',
        alignSelf:'center'
      }} value={rainState} onValueChange={() => setRainState(!rainState)}/>
    }
  ];

  return (
    <View style={styles.container}>
      <FlatList
      data={
        featureNameList
      }
      
      renderItem={({item}) => 
        (
        <TouchableWithoutFeedback onPress={()=> {
          if(item.featureComponent != null){
          setChildComponent(item.featureComponent);
          setFeatureModalVisible(true);
          }
        }}>
        <View style={styles.item}>
          {item.icon}
          <Text style={styles.text}>{item.name}</Text>
          {item.extendComponent}
        </View>
        </TouchableWithoutFeedback>)
      }
      />
      <FeatureModalComponent modalVisible={FeatureModalVisible} setModalVisible={setFeatureModalVisible} childComponent={childComponent}/>
    </View>
  )
}

export default SettingScreen;