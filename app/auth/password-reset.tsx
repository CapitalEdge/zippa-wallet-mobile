import React, { memo, useState } from 'react'
import { Container, EditShowContainer } from '../../components/Themed'
import styled from 'styled-components/native'
import { Text } from '../../components/Themed'
import { theme } from '../../constants/Colors'
import { View } from 'react-native'
import { FormField } from '../../helpers/types'
import { useAuthStore } from '../../stores/feature/auth'
import { useGlobalStore } from '../../stores/store'
import Toast from 'react-native-simple-toast';
import { Ionicons } from '@expo/vector-icons'
import { Stack, router } from 'expo-router'
import ZippaButton from '../../components/Button'

function PasswordResetScreen(): JSX.Element {

    const [maskPassword, setMaskPassword] = useState<boolean>(true);
    const [maskConfirmPassword, setMaskConfirmPassword] = useState<boolean>(true);
    const [password, setPassword] = React.useState<FormField['password']>('');
    const [confirmpassword, setConfirmPassword] = React.useState<FormField['password']>('');

    const setAppState = useGlobalStore((state) => state.setAppState);

    const updatePassword = useAuthStore(state => state.updatePassword);

    const handleLogin = async () => {
        setAppState('LOADING');
        if (password) {
            await updatePassword(password);
            Toast.showWithGravity(
                'Password reset success',
                Toast.SHORT,
                Toast.BOTTOM,
            );
            setAppState('IDLE');
            router.replace("/auth/login")
        } else {
            setAppState('IDLE');
            Toast.showWithGravity(
                'Passwords do not match',
                Toast.SHORT,
                Toast.BOTTOM,
            );
        }
    }

    return (
        <>
            <Stack.Screen options={{
                title: 'Password Reset'
            }} />
            <Container>
                <LoginContent>
                    <Text fontSize={18} fontFamily='zippa-regular'>Setup a new password</Text>
                    <InputBox>
                        <Text fontSize={16} fontFamily='zippa-regular'>New password</Text>
                        <Password
                            onChangeText={setPassword}
                            value={password}
                            clearTextOnFocus
                            textContentType="password"
                            secureTextEntry={maskPassword}
                            cursorColor={theme.colors.zippaBlack}
                        />
                        <EditShowContainer onPress={() => setMaskPassword(!maskPassword)}>
                            <Ionicons name={maskPassword ? 'eye-off' : 'eye'} size={22} color={theme.colors.zippaBlack} />
                        </EditShowContainer>
                    </InputBox>

                    <InputBox>
                        <Text fontSize={16} fontFamily='zippa-regular'>Confirm new password</Text>
                        <Password
                            onChangeText={setConfirmPassword}
                            value={confirmpassword}
                            clearTextOnFocus
                            textContentType="password"
                            secureTextEntry={maskConfirmPassword}
                            cursorColor={theme.colors.zippaBlack}
                        />
                        <EditShowContainer onPress={() => setMaskConfirmPassword(!maskConfirmPassword)}>
                            <Ionicons name={maskConfirmPassword ? 'eye-off' : 'eye'} size={22} color={theme.colors.zippaBlack} />
                        </EditShowContainer>
                    </InputBox>

                    <View>
                        <ZippaButton text='Reset Password' action={handleLogin} /> 
                    </View>

                </LoginContent>
            </Container>
        </>
    )
}

export default memo(PasswordResetScreen)

const LoginContent = styled.View`
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
  padding-top: 50px;
  background-color: ${theme.colors.zippaLight};
  `;

const InputBox = styled.View`
  margin: 20px 0;
  background-color: ${theme.colors.zippaWhite};
  border-radius: 10px; 
  padding: 10px;
`;

const Password = styled.TextInput`
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