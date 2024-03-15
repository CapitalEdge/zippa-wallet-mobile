import React from 'react'
import { theme } from '../../constants/Colors'
import { Stack } from 'expo-router'
import ZippaModal from '../../components/ZippaModal'

export default function PageScreensLayout() {
    
  return (
    <>
      <Stack screenOptions={{
        animation: "none",
        headerShown: false,
        headerTintColor: theme.colors.zippaLight,
        headerStyle: {
          backgroundColor: theme.colors.zippaBlue
        }
      }} />
      <ZippaModal />
    </>
  )
}