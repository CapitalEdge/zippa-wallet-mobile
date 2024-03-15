import React, { useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { Savings, ScreenContent, Text, theme } from '../../../../components/Themed'
import { View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useSavingsStore } from '../../../../stores/feature/savings'

export default function ThriftSavings() {
    const [savingsFrequency, getSavingsFrequency] = useSavingsStore(state => [state.savingsFrequency, state.getSavingsFrequency]);

    useEffect(() => {
        getSavingsFrequency();
    }, [savingsFrequency]);

    return (
        <>
            <Stack.Screen options={{
                title: 'Zippa Thrift',
                animation: 'none',
                headerShown: true, 
            }} />
            <ScreenContent>
                <View style={{ paddingVertical: 20, backgroundColor: theme.colors.zippaOrange, padding: 25, borderRadius: 5, marginVertical: 20 }}>
                    <Text fontSize={18} fontFamily='zippa-semibold' color={theme.colors.zippaLight}>Get started with a thrift plan</Text>
                    <Text fontSize={14} color={theme.colors.zippaLight}>Save money little by little. Grow your finance</Text>
                </View>
                <Savings onPress={() => router.push("/screens/(savings)/zippa-thrift/thrift-savings")} borderColor={theme.colors.zippaOrange}>
                    <View>
                        <Text fontSize={16} fontFamily='zippa-semibold' color={theme.colors.zippaOrange}>Thrift Savings</Text>
                        <Text fontSize={14}>Daily contribution the easy way</Text>
                        <Text fontSize={10} color={theme.colors.zippaGrey}>Save at 1.5% monthly interest</Text>
                    </View>
                    <FontAwesome name="child" size={30} color={theme.colors.zippaOrange} />
                </Savings>
            </ScreenContent>
        </>
    )
}
