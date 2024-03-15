import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';

export default function NoDataList({loading, color}: {loading: boolean, color: string}) {
  return (
      loading ? <ActivityIndicator size={25} color={color} style={{ marginTop: 50 }} /> : <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 50 }}>
          <Text>You do not have any savings</Text>
          <Entypo name="emoji-sad" size={40} style={{ marginVertical: 20 }} />
      </View>
  )
};