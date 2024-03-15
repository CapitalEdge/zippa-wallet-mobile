import React, { useEffect, useState } from 'react'
import { Container } from '../../components/Themed'
import styled from 'styled-components/native'
import { Text } from '../../components/Themed'
import { theme } from '../../constants/Colors'
import { Pressable } from 'react-native'
import { OtpInput } from 'react-native-otp-entry';
import { Stack, router } from 'expo-router'
import { useAuthStore } from '../../stores/feature/auth'
import { useGlobalStore } from '../../stores/store'
import Toast from 'react-native-simple-toast';
import { MMKVStorage } from '../../stores/mmkv-storage'
import ZippaButton from '../../components/Button'


export default function ForgotPasswordOTPScreen() {

    const setAppState = useGlobalStore((state) => state.setAppState);
    const [verifyOTP, resendOTP] = useAuthStore(state => [state.verifyOTP, state.resendOTP]);

    const resetPassword = useAuthStore(state => state.resetPassword)

    const [emailAddress, setEmailAddress] = React.useState<string>('');
    const [otpInput, setOtpInput] = React.useState('');
    const [time, setTime] = useState(0);

    const __handleOTPVerification = async () => {
        setAppState('LOADING');
        const code = otpInput;

        if (emailAddress !== null) {
            const { verifyError } = await verifyOTP(emailAddress, code);
            MMKVStorage.removeItem('@email');

            if (verifyError === null) {
                setAppState('IDLE');
                router.push('/auth/password-reset'); //reset pass screen
            } else {
                setAppState('IDLE');
                Toast.showWithGravity(
                    'Invalid OTP',
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                return;
            }

        } else {
            setAppState('IDLE');
            Toast.showWithGravity(
                'Operation not permitted',
                Toast.SHORT,
                Toast.BOTTOM,
            );
        }
    }

    //set  60 seconds timer
    const __timer = async () => {
        let counter = 60;
        const interval = setInterval(() => {
            if (counter > 0) {
                setTime(counter);
                counter--;
            } else {
                clearInterval(interval);
                setTime(0)
            }
        }, 1000);
        Toast.showWithGravity(
            'OTP Resent. Check your email address',
            Toast.SHORT,
            Toast.BOTTOM,
        );
    }

    const __resendPasswordOtpVerification = async () => {
        setAppState("LOADING")
        await resetPassword(emailAddress)
        setAppState("IDLE");
        await __timer();
    }

    useEffect(() => {
        const email = MMKVStorage.getItem('@email');
        setEmailAddress(email as string);
    }, []);

    return (
        <>
            <Stack.Screen options={{
                title: 'Password OTP Verification'
            }} />
            <Container>
                <OTPContent>
                    <Text fontSize={18} fontFamily='zippa-regular'>A 6 digit verification code has been sent to your email address.</Text>
                    <InputBox>
                        <OtpInput
                            numberOfDigits={6}
                            focusColor={theme.colors.zippaBlue}
                            onTextChange={setOtpInput}
                        />
                    </InputBox>
                    <OTPTextContainer>
                        <Text style={{ marginBottom: 20, textAlign: 'center' }} fontSize={14}>Didn't get the code?</Text>
                        {time === 0 ? <Pressable onPress={__resendPasswordOtpVerification}>
                            <Text color={theme.colors.zippaGreen} fontSize={14} fontFamily='zippa-semibold'>
                                Resend code
                            </Text>
                        </Pressable> : <Text color={theme.colors.zippaBlue} fontFamily='zippa-semibold' fontSize={14}>Retry in {time} secs</Text>}
                    </OTPTextContainer>

                    <ZippaButton text='Verify' action={__handleOTPVerification} />

                </OTPContent>
            </Container>
        </>
    )
}



const OTPContent = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 0 5%;
  padding-top: 20px;
  background-color: ${theme.colors.zippaLight};
  `;

const InputBox = styled.View`
  margin: 40px 0;
  background-color: ${theme.colors.zippaWhite};
  border-radius: 10px; 
  padding: 10px;
`;

const OTPTextContainer = styled.Pressable`
    display: flex;
    flex-direction: row;
    justify-content: center;
    alogn-items: center;
    gap: 10px;
`;