import React from 'react'
import { Stack } from 'expo-router'
import { theme } from '../../constants/Colors'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{
      headerTitleStyle: {
        fontSize: 20,
        color: 'white'
      },
      headerStyle: {
        backgroundColor: theme.colors.zippaBlue,
      },
      headerTintColor: 'white',
    }} />
  )
}