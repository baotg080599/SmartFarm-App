import { Modal,View,Text } from 'react-native'
import React from 'react'

const FarmModal = ({setModalVisible, modalVisible}) => {
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
    >
        <Text>test</Text>
    </Modal>
  )
}

export default FarmModal