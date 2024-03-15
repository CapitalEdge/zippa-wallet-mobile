import React, { useState } from 'react';
import { Input, InputBox, ScreenContent, Text } from '../../../components/Themed';
import { Stack, router } from 'expo-router';
import { View } from 'react-native';
import ZippaButton from '../../../components/Button';
import { useAuthStore } from '../../../stores/feature/auth';
import Toast from 'react-native-simple-toast';
import { useGlobalStore } from '../../../stores/store';

export default function ResetTransactionPin() {

    const [oldPin, setOldPin] = useState<string>('');
    const [newPin, setNewPin] = useState<string>('');
    const [confirmNewPin, setConfirmNewPin] = useState<string>('');
    const setAppState = useGlobalStore(state => state.setAppState);
    const confirmTransactionPin = useAuthStore().confirmTransactionPin;
    const updateTransactionPin = useAuthStore().updateTransactionPin;

    //call check transaction pin
    async function pinCheck() {
        if (oldPin.length < 4 || newPin.length < 4 || confirmNewPin.length < 4) {
            Toast.showWithGravity(
                'All pin must be 4 digits',
                Toast.SHORT,
                Toast.BOTTOM,
            );
            return;
        }
        if (oldPin === newPin) {
            Toast.showWithGravity(
                'Old and new pin cannot be the same',
                Toast.SHORT,
                Toast.BOTTOM,
            );
            return;
        }
        if (!oldPin) {
            Toast.showWithGravity(
                'Old pin is required',
                Toast.SHORT,
                Toast.BOTTOM,
            );
            return;
        }
        if (newPin !== confirmNewPin) {
            Toast.showWithGravity(
                'New pin and confirm new pin do not match',
                Toast.SHORT,
                Toast.BOTTOM,
            );
            return;
        } else {
            const transactionPin = await confirmTransactionPin(oldPin);
            if (!transactionPin) {
                Toast.showWithGravity(
                    'Old pin in not correct',
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            } else {
                await updateTransactionPin(newPin);
                Toast.showWithGravity(
                    'Pin change succesful',
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                router.push("/screens/(tabs)/more")
            }
        }
    }

    //call set transaction pin and 
    //handle rest
    const handleReset = async () => {
        setAppState("LOADING")
        await pinCheck();
        setAppState("IDLE");
        
    };
  return (
    <>
          <Stack.Screen
              options={{
                  title: "Reset transaction pin",
                  headerShown: true
              }} />
          <ScreenContent>
              <View style={{marginVertical: 20}}>
                  <Text>Reset your transaction pin only if you feel it is open and compromised</Text>
              </View>
              <InputBox>
                  <Text>Old pin</Text>
                  <Input
                      secureTextEntry={true}
                      keyboardType="number-pad"
                      maxLength={6}
                      onChangeText={setOldPin}
                  />
              </InputBox>
              <InputBox>
                  <Text>New pin</Text>
                  <Input
                      secureTextEntry={true}
                      keyboardType="number-pad"
                      maxLength={6}
                      onChangeText={setNewPin}
                  />
              </InputBox>
              <InputBox>
                  <Text>Confrim new pin</Text>
                  <Input
                      secureTextEntry={true}
                      keyboardType="number-pad"
                      maxLength={6}
                      onChangeText={setConfirmNewPin}
                  />
              </InputBox>
              <ZippaButton action={handleReset} text={'Reset pin'} />
          </ScreenContent>
    </>
  )
}