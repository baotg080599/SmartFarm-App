import { Modal, TouchableOpacity, TouchableWithoutFeedback,View } from 'react-native';
import React from 'react';

const FeatureModalComponent = ({setModalVisible, modalVisible, childComponent}) => {
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
    >
    <TouchableOpacity
    style={{    
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "stretch",
        marginTop: 22
    }} 
        activeOpacity={1} 
        onPressOut={() => {setModalVisible(false)}}
        >
            <TouchableWithoutFeedback>
                <View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: 'row',
                    backgroundColor: "white",
                    height:500,
                    borderRadius: 40,
                    paddingBottom: '10%',
                    paddingTop:'5%',
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}>
                {childComponent}
                </View>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
    </Modal>
    
  )
}

export default FeatureModalComponent;