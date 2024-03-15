import React from 'react'
import { Stack } from 'expo-router'
import ConfirmationPin from '../../components/ConfirmationPin'

export default function EnterConfirmationPin() {
    return (
        <>
            <Stack.Screen options={{
                headerShown: false,
                animation: 'none'
            }} />
            <ConfirmationPin />
        </>
    )
};