import { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { theme } from '../../../constants/Colors'
import { FormField } from '../../../helpers/types'
import { useGlobalStore } from '../../../stores/store'
import { useAuthStore } from '../../../stores/feature/auth'
import Toast from 'react-native-simple-toast';
import { Container } from '../../../components/Themed'
import { Text, EditShowContainer, ScrollScreen } from '../../../components/Themed'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { Stack, router } from 'expo-router'
import React from 'react'
import { MMKVStorage } from '../../../stores/mmkv-storage'
import { Ionicons } from '@expo/vector-icons'
import ZippaButton from '../../../components/Button'

export default function SignupScreen() {

    const [maskPassword, setMaskPassword] = useState<boolean>(true);
    const [maskConfirmPassword, setMaskConfirmPassword] = useState<boolean>(true);
    const [email, setEmail] = useState<FormField['email']>('');
    const [phone, setPhone] = useState<FormField['phone']>('');
    const [password, setPassword] = useState<FormField['password']>('');
    const [confirm_password, setConfirmPassword] = useState<FormField['confirm_password']>('');


    const setAppState = useGlobalStore((state) => state.setAppState);

    const [signup, error, data] = useAuthStore(state => [
        state.signup,
        state.error,
        state.data
    ]);

    //clear transaction pin incase user tries to register with the same device again.
    React.useEffect(() => {
        MMKVStorage.clearAll();
    }, []);

    const __comparePassword = () => {
        if (password === confirm_password) {
            return true;
        } else {
            return false;
        }
    };

    const __checkAndSignup = async () => {
        //check if user is already registered. If not, signup.
        if (data?.user && data?.user?.identities && data?.user?.identities?.length === 0) {
            setAppState('IDLE');
            Toast.showWithGravity(
                'Email user already exists',
                Toast.SHORT,
                Toast.BOTTOM,
            );
        } else if (data?.user && data?.user?.identities && data?.user?.identities?.length > 0) {
            setAppState('LOADED');
            //send otp
            router.replace('/auth/(register)/otp');
        } else if (!data?.user && data?.user?.identities && error?.__isAuthError) {
            setAppState('IDLE');
            Toast.showWithGravity(
                'Something went wrong. Try again',
                Toast.SHORT,
                Toast.BOTTOM,
            );
        } else {
            setAppState('IDLE');
        }
    }


    const handleSignup = async () => {
        setAppState('LOADING');
        const valid = __comparePassword();
        //force user to enter all fields
        if (!email || !password || !confirm_password || !phone) {
            setAppState('IDLE');
            Toast.showWithGravity(
                'All fields are required for registration',
                Toast.SHORT,
                Toast.BOTTOM,
            );
        }
        //call the signup method only if password match.
        if (valid) {
            //save the email and phone number in the local storage for session retrieval on next screen
            MMKVStorage.setItem('@email', email.toLowerCase());
            MMKVStorage.setItem('@phone', phone!);
            await signup(email.toLowerCase(), password);
        } else {
            setAppState('IDLE');
            Toast.showWithGravity(
                'Passwords do not match',
                Toast.SHORT,
                Toast.BOTTOM,
            );
        }
        setAppState('IDLE');
    }


    useEffect(() => {
        __checkAndSignup();
    }, [data]);

    return (
        <>
            <Stack.Screen options={{
                title: 'Create account'
            }} />
            <Container>
                <SignupContent>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <Text fontSize={18} fontFamily='zippa-regular'>
                            Welcome comrade! Kindly create an account to proceed
                        </Text>
                        <InputBox>
                            <Text fontSize={16} fontFamily='zippa-regular'>Email</Text>
                            <Email
                                onChangeText={setEmail}
                                value={email}
                                clearTextOnFocus
                                textContentType='emailAddress'
                                cursorColor={theme.colors.zippaGrey}
                                inputMode='email'
                                clearButtonMode='while-editing'
                                placeholder={`Enter your email`}
                            />
                        </InputBox>

                        <InputBox>
                            <Text fontSize={16} fontFamily='zippa-regular'>Phone</Text>
                            <Phone
                                onChangeText={setPhone}
                                value={phone}
                                clearTextOnFocus
                                cursorColor={theme.colors.zippaGrey}
                                inputMode='tel'
                                clearButtonMode='while-editing'
                                maxLength={11}
                                placeholder={`Enter your number`}
                            />
                        </InputBox>
                        <InputBox>
                            <Text fontSize={16} fontFamily='zippa-regular'>Password</Text>
                            <Password
                                onChangeText={setPassword}
                                value={password}
                                clearTextOnFocus
                                textContentType="newPassword"
                                cursorColor={theme.colors.zippaGrey}
                                inputMode='text'
                                secureTextEntry={maskPassword}
                                placeholder={`Choose a password`}
                            />
                            <EditShowContainer onPress={() => setMaskPassword(!maskPassword)}>
                                <Ionicons name={maskPassword ? 'eye-off' : 'eye'} size={22} color={theme.colors.zippaBlack} />
                            </EditShowContainer>
                        </InputBox>
                        <InputBox>
                            <Text fontSize={16} fontFamily='zippa-regular'>Confirm password</Text>
                            <ConfirmPassword
                                onChangeText={setConfirmPassword}
                                value={confirm_password}
                                clearTextOnFocus
                                textContentType="newPassword"
                                inputMode='text'
                                secureTextEntry={maskConfirmPassword}
                                placeholder={`Confirm your password`}
                                cursorColor={theme.colors.zippaGrey}
                            />
                            <EditShowContainer onPress={() => setMaskConfirmPassword(!maskConfirmPassword)}>
                                <Ionicons name={maskConfirmPassword ? 'eye-off' : 'eye'} size={22} color={theme.colors.zippaBlack} />
                            </EditShowContainer>
                        </InputBox>

                        <View>
                            <ZippaButton text='Create account' action={handleSignup} />
                        </View>
                    </KeyboardAvoidingView>
                </SignupContent>
            </Container>
        </>
    )
};



const SignupContent = styled(ScrollScreen)`
  display: flex;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 0 5%;
  padding-top: 20px;
  `;

const InputBox = styled.View`
  margin: 20px 0;
  background-color: ${theme.colors.zippaWhite};
  border-radius: 10px; 
  padding: 10px;
`;

const Email = styled.TextInput`
  width: 100%;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.zippaGrey};
  padding: 5px 5px;
  font-size: 16px;
  font-family: 'zippa-regular';
  `;

const Phone = styled(Email)``;
const Password = styled(Email)``;
const ConfirmPassword = styled(Email)``;

