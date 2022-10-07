import React from 'react';
import { Modal, StyleSheet, Text, View  } from "react-native";
import ScrollPicker from 'react-native-wheel-scrollview-picker';

const TimePicker = ({ setChange, value, setModalVisible, modalVisible }) => {

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

export default TimePicker;