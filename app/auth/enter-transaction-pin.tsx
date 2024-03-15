import React from 'react'
import TransactionPin from '../../components/TransactionPin'
import { Stack } from 'expo-router'

export default function EnterTransactioninScreen() {
    return (
        <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <TransactionPin Mode={'Enter'} />
        </>
    )
};