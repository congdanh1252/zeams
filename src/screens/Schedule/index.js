import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Event} from '../../components/Event';
import COLOR from '../../theme';

export const SchedulesScreen = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          width: '98%',
          marginBottom: 16,
        }}>
        <Text style={{marginBottom: 4}}>19-09-2021 | Sunday</Text>

        <View
          style={{
            width: '95%',
          }}>
          <Event />
          <Event />
          <Event />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.white,
  },
  fullWidth: {
    width: '100%',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 2,
  },
  blackButton: {
    backgroundColor: COLOR.primary,
  },
  whiteButton: {
    backgroundColor: COLOR.white,
    borderColor: COLOR.primary,
  },
  blackText: {
    color: '#000',
  },
  whiteText: {
    color: COLOR.white,
  },
  videoFrame: {
    width: '90%',
    height: '50%',
    marginTop: 20,
    borderRadius: 10,
  },
});
