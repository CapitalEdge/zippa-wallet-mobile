import React from 'react'
import { Stack, router } from 'expo-router'
import { Savings, ScreenContent, Text, theme } from '../../../../components/Themed'
import { View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function LockSavings() {
    return (
        <>
            <Stack.Screen options={{
                title: 'Zippa Lock',
                animation: 'none',
                headerShown: true, 
            }} />
            <ScreenContent>
                <View style={{ paddingVertical: 20, backgroundColor: theme.colors.zippaViolet, padding: 25, borderRadius: 5, marginVertical: 20 }}>
                    <Text fontSize={18} fontFamily='zippa-semibold' color={theme.colors.zippaLight}>Set a LOCK savings plan</Text>
                    <Text fontSize={14} color={theme.colors.zippaLight}>Lock your money away for a fixed period of time. Feed your focus.</Text>
                </View>
                {ZippaLock.map(item => <Savings key={item.id} onPress={() => router.push(item.link as any)}>
                    <View>
                        <Text fontSize={16} fontFamily='zippa-semibold' color={theme.colors.zippaViolet}>{item.title}</Text>
                        <Text fontSize={14}>{item.subtitle}</Text>
                        <Text fontSize={10} color={theme.colors.zippaGrey}>{item.description}</Text>
                    </View>
                    <FontAwesome name="lock" size={30} color={theme.colors.zippaViolet} />
                </Savings>
                )}
            </ScreenContent>
        </>
    )
}


const ZippaLock = [
    {
        id: 1,
        title: "Fixed Deposit",
        subtitle: "Save and Lock",
        description: "Lock up to 12 Months",
        link: "/screens/(savings)/zippa-lock/fixed-deposit"
    },
    {
        id: 2,
        title: "Savings With Benefits",
        subtitle: "Diamond | Gold | Silver | Bronze | Basic",
        description: "Lock up to 12 Months",
        link: "/screens/(savings)/zippa-lock/savings-with-benefits"
    },
    {
        id: 3,
        title: "Smart Kiddies Savings",
        subtitle: "Smart 100 | Smart 50 | Smart 30 | Smart 10",
        description: "Lock up to 12 Months",
        link: "/screens/(savings)/zippa-lock/smart-kiddies-savings"
    },
]

