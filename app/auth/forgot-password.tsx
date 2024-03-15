import React from 'react'
import { Container } from '../../components/Themed'
import styled from 'styled-components/native'
import { Text } from '../../components/Themed'
import { theme } from '../../constants/Colors'
import { FormField } from '../../helpers/types'
import { useAuthStore } from '../../stores/feature/auth'
import { useGlobalStore } from '../../stores/store'
import { MMKVStorage } from '../../stores/mmkv-storage'
import { Stack, router } from 'expo-router'
import ZippaButton from '../../components/Button'

export default function ForgotPasswordScreen() {

    const [email, setEmail] = React.useState<FormField['email']>('');
    const setAppState = useGlobalStore(state => state.setAppState)
    const resetPassword = useAuthStore(state => state.resetPassword)

    async function __handlePasswordReset() {
        setAppState("LOADING")
        MMKVStorage.setItem("@email", email);
        await resetPassword(email)
        setAppState("IDLE")
        router.push("/auth/forgot-password-otp")
    }
    
    return (
        <>
            <Stack.Screen options={{
                title: 'Forgot password'
            }} />
            <Container>
                <ResetPasswordContent>
                    <Text fontSize={18} fontFamily='zippa-regular'>Enter your email to reset password</Text>
                    <InputBox>
                        <Text fontSize={16} fontFamily='zippa-regular'>Email</Text>
                        <Email
                            onChangeText={setEmail}
                            value={email}
                            clearTextOnFocus
                            textContentType='emailAddress'
                            cursorColor={theme.colors.zippaGrey}
                            placeholder={`Enter your email`}
                            
                        />
                    </InputBox>

                    <ZippaButton text='Reset password' action={__handlePasswordReset} />

                    <Text style={{ marginTop: 20, textAlign: 'center' }} fontSize={14}>You will recieve an email with a link to set a <Text color={theme.colors.zippaGreen} fontSize={14} fontFamily='zippa-regular'>
                        new password</Text></Text>
                </ResetPasswordContent>
            </Container>
        </>
    )
}



const ResetPasswordContent = styled.View`
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
  margin: 40px 0  20px 0;
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
