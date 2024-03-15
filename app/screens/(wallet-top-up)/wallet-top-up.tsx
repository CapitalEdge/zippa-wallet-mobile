import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { theme } from '../../../constants/Colors'
import { Container, ScreenContent, Text } from '../../../components/Themed'
//@ts-ignore
import VirtualKeyboard from 'react-native-virtual-keyboard';
import ZippaButton from '../../../components/Button'

export default function funding() {
    const [text, setText] = useState<string>('0.00');
    const [disabled, setDisabled] = useState(true);

    const changeText = (newText: string) => {
        setText(newText)
    }

    useEffect(() => {
        if (parseFloat(text) > 3000) {
            setDisabled(false)
        } else {
            setDisabled(true);
        }
    }, [text]);
  return (
      <>
          <Stack.Screen options={{
              headerShown: false,
              animation: 'none'
              //animation: 'slide_from_bottom',
          }} />
          <Container>
              <ScreenContent>
                  <View style={{gap: 5}}>
                      <Text fontSize={14} style={{ alignSelf: 'center'}}>Enter amount to fund</Text>
                      <Text fontFamily="zippa-semibold" fontSize={34} style={{ alignSelf: 'center' }}>₦{parseFloat(text).toLocaleString()}</Text>
                      <Text fontSize={12} color={theme.colors.zippaRed} style={{ alignSelf: 'center' }}>Minimum amount: ₦3,000</Text>
                  </View>
                  <VirtualKeyboard  color={theme.colors.zippaBlack} pressMode='string' onPress={(val: string) => changeText(val)} cellStyle={{ borderWidth: 0, backgroundColor: theme.colors.zippaWhite, borderRadius: 5, padding: 5, marginVertical: 10, marginHorizontal: 15 }}  />
                  <View style={{marginVertical: 25}}>
                      <ZippaButton text={'Continue'} disabled={disabled} />
                  </View>
              </ScreenContent>
     </Container>
    </>
  )
}