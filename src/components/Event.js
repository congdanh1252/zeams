import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

import COLOR from '../theme';

export const Event = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{position: 'absolute', right: 4, top: 4}}>
        <Ionicons
          name="close-circle-outline"
          size={25}
          color={COLOR.white}></Ionicons>
      </TouchableOpacity>
      <Text style={styles.whiteText}>Meeting</Text>
      <Text style={styles.whiteText}>03:55 PM - 04:30PM</Text>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.fontBold}>Start</Text>
      </TouchableOpacity>

      <Text style={[styles.whiteText, styles.meetingId]}>
        ID: 6161545445845
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    backgroundColor: COLOR.primary,
    margin: 4,
    padding: 16,
    borderRadius: 4,
  },
  whiteText: {
    color: COLOR.white,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  startButton: {
    alignItems: 'center',
    maxWidth: '25%',
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLOR.white,
  },
  meetingId: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    alignSelf: 'flex-end',
  },
});
