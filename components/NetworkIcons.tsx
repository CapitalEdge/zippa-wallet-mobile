import {Pressable, Image } from 'react-native'
import React from 'react'
import { theme } from './Themed'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function NetworkIcons({value, setValue, data}: any) {
    const selectNetwork = (param: string) => {
        setValue(param);
    }
  return (
      <Pressable style={{ width: 75, height: 45, backgroundColor: theme.colors.zippaWhite, paddingVertical: 20, borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: (value === data?.name) ? 1 : 0, borderColor: theme.colors.zippaGreen }} onPress={() => selectNetwork(data.name)}>
          <Image source={data?.logo} resizeMode="contain" resizeMethod="auto" style={{ borderRadius: 50, width: 30, height: 30, }} />
          {value === data?.name && <Ionicons name="checkmark" size={14} style={{ position: "absolute", right: 0, top: 0, backgroundColor: theme.colors.zippaGreen, color: theme.colors.zippaWhite, borderTopRightRadius: 8 }} />}
      </Pressable>
  )
}