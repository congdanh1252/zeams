import React from "react"
import Modal from "react-native-modal"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator, StyleSheet, View, Text } from "react-native"

const NetworkModal = () => {
  const title = 'Network Error'
  const message = 'Lost connection to the internet.\nPlease try to reconnect again...'

  return (
    <Modal
      isVisible={true}
      coverScreen={true}
      backdropOpacity={0.2}
      useNativeDriver={true}
      animationIn='slideInRight'
      animationOut='slideOutRight'
    >
      <View style={styles.modalContent}>
        <Ionicons
          size={70}
          color={'#FFE1B1'}
          style={styles.alertIcon}
          name={'alert-circle-outline'}
        />
        
        <Text style={styles.modalTitle}>{title}</Text>

        <Text style={styles.modalMessage}>{message}</Text>

        <ActivityIndicator color={'#fff'} size={'large'} style={styles.loadingIndicator}/>
      </View>
    </Modal>
  )
}

export default NetworkModal

const styles = StyleSheet.create({
  modalContent: {
    width: '84%',
    height: 236,
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },
  modalIconHolder: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  modalTitle: {
    fontSize: 15,
    marginTop: 6,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center'
  },
  modalMessage: {
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  alertIcon: {
    marginTop: 12
  },
  loadingIndicator: {
    marginTop: 16
  }
})