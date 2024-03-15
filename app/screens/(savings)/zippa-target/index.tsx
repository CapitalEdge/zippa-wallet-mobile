import React, {useEffect} from 'react'
import { Stack, router } from 'expo-router'
import { Savings, ScreenContent, Text, theme } from '../../../../components/Themed'
import { View } from 'react-native'
import { Foundation } from '@expo/vector-icons'
import { useSavingsStore } from '../../../../stores/feature/savings'

export default function ZippaTarget() {
  const [savingsFrequency, getSavingsFrequency] = useSavingsStore(state => [state.savingsFrequency, state.getSavingsFrequency]);

  useEffect(() => {
    getSavingsFrequency();
  }, [savingsFrequency]);
  return (
    <>
      <Stack.Screen options={{
        title: 'Zippa Target',
        animation: 'none',
        headerShown: true,
      }} />
      <ScreenContent>
        <View style={{ paddingVertical: 20, backgroundColor: theme.colors.zippaLightBlue, padding: 25, borderRadius: 5, marginVertical: 20 }}>
          <Text fontSize={18} fontFamily='zippa-semibold' color={theme.colors.zippaLight}>Set a TARGET savings plan</Text>
          <Text fontSize={14} color={theme.colors.zippaLight}>Save towards a particular goal. Don't limit yourself by one goal</Text>
        </View>
        <Savings borderColor={theme.colors.zippaLightBlue} onPress={() => router.push('/screens/(savings)/zippa-target/target-savings/')}>
          <View>
            <Text fontSize={16} fontFamily='zippa-semibold' color={theme.colors.zippaLightBlue}>Target Savings</Text>
            <Text fontSize={14}>Flex & Manual Savings</Text>
            <Text fontSize={10} color={theme.colors.zippaGrey}>Target up to 6 months</Text>
          </View>
          <Foundation name="target-two" size={30} color={theme.colors.zippaLightBlue} />
        </Savings>
      </ScreenContent>
    </>
  )
}
