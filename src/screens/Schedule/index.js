import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'

import COLOR from '../../theme'
import { statusBarHeight } from '../../constants'

const DATA = [
  {
    date: '19-09-2022 | Sunday',
    data: [
      {
        id: '19525912',
        title: 'Office meeting',
        start_time: '03:55 PM',
        end_time: '04:25 PM'
      },
      {
        id: '19525913',
        title: 'Fun meet',
        start_time: '03:55 PM',
        end_time: '04:25 PM'
      }
    ]
  },
  {
    date: '20-09-2022 | Monday',
    data: [
      {
        id: '19525914',
        title: 'Call Bob',
        start_time: '03:55 PM',
        end_time: '04:25 PM'
      },
      {
        id: '19525915',
        title: 'MoMo interview',
        start_time: '03:55 PM',
        end_time: '04:25 PM'
      },
      {
        id: '19525916',
        title: 'Call Alice',
        start_time: '03:55 PM',
        end_time: '04:25 PM'
      },
      {
        id: '19525917',
        title: 'Conference',
        start_time: '03:55 PM',
        end_time: '04:25 PM'
      },
    ]
  },
]

const renderItem = ({ item }) => {
  return (
    <View style={styles.singleDate}>
      <Text style={[styles.blackText, styles.dateText]}>{item.date}</Text>

      {
        item.data.map((card) => {
          return (
            <View
              key={card.id}
              style={styles.card}
            >
              <TouchableOpacity
                activeOpacity={0.2}
                style={styles.closeBtn}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={COLOR.white}
                />
              </TouchableOpacity>

              <Text
                numberOfLines={1}
                style={[styles.whiteText, styles.title, styles.textRow]}
              >
                {card.title}
              </Text>

              <Text style={[styles.whiteText, styles.textRow]}>
                {card.start_time} - {card.end_time}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.startButton}
              >
                <Text style={styles.blackText}>Start</Text>
              </TouchableOpacity>

              <Text style={[styles.grayText, styles.meetingId]}>
                ID: {card.id}
              </Text>
            </View>
          )
        })
      }
    </View>
  )
}

export const SchedulesScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        horizontal={false}
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={item => item.date}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 4,
    paddingHorizontal: 12,
    marginTop: statusBarHeight,
  },
  list: {
    width: '100%',
  },
  singleDate: {
    marginTop: 12
  },
  card: {
    width: '100%',
    borderRadius: 7,
    marginVertical: 6,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black,
  },
  closeBtn: {
    top: 16,
    right: 16,
    padding: 4,
    position: 'absolute',
  },
  startButton: {
    width: '32%',
    height: 32,
    marginTop: 8,
    maxWidth: '32%',
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.white,
  },
  blackText: {
    color: COLOR.black,
  },
  whiteText: {
    color: COLOR.white,
  },
  dateText: {
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  grayText: {
    color: COLOR.gray
  },
  textRow: {
    width: '76%'
  },
  meetingId: {
    bottom: 16,
    right: 16,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
})
