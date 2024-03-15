import React, { memo, useCallback, useEffect, useState } from 'react'
import { Container, EditShowContainer } from '../../components/Themed'
import styled from 'styled-components/native'
import { Text } from '../../components/Themed'
import { theme } from '../../constants/Colors'
import { View } from 'react-native'
import { FormField } from '../../helpers/types'
import { Link, Stack, router } from 'expo-router'
import { useAuthStore } from '../../stores/feature/auth'
import { useGlobalStore } from '../../stores/store'
import Toast from 'react-native-simple-toast';
import { Ionicons } from '@expo/vector-icons';
import ZippaButton from '../../components/Button'


function LoginScreen(): JSX.Element {

  const [maskPassword, setMaskPassword] = useState<boolean>(true);
  const [email, setEmail] = useState<FormField['email']>('');
  const [password, setPassword] = useState<FormField['password']>('');
  const setAppState = useGlobalStore((state) => state.setAppState);
  
  const [login, data, error, isAuthenticated] = useAuthStore(state =>[
      state.login,
      state.data,
      state.error,
      state.isAuthenticated,
    ]);

  const handleLogin = async () => {

    setAppState('LOADING');
    if (email && password) {
      await login(email, password);
    } else {
      setAppState('IDLE');
      Toast.showWithGravity(
        'Enter login credentials',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    }
  }

  async function checkAndEnter() {
    if (data && isAuthenticated) {
      setAppState('LOADED');
      router.replace('/auth/enter-transaction-pin');
    }
  };

  async function checkForError() {
    if (!isAuthenticated && error?.__isAuthError) {
      setAppState('IDLE');
      Toast.showWithGravity(
        'Invalid login credentials',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    }
  }

  const LoginCheck = useCallback(() => {
    checkAndEnter();
    checkForError();
  }, [isAuthenticated, error]);


  useEffect(() => {
    LoginCheck();
  }, [isAuthenticated, error]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Container>
        <LoginLogoContainer>
          <LoginLogo source={require('../../assets/images/zippa-icon.png')} />
          <Text fontFamily='zippa-semibold' color={theme.colors.zippaWhite} style={{ textAlign: 'center', paddingTop: 20 }}>Welcome</Text>
        </LoginLogoContainer>
        <LoginContent>
          <Text fontSize={18} fontFamily='zippa-regular'>Login securely into your account</Text>
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

          <InputBox>
            <Text fontSize={16} fontFamily='zippa-regular'>Password</Text>
            <Password
              onChangeText={setPassword}
              value={password}
              clearTextOnFocus
              textContentType="password"
              secureTextEntry={maskPassword}
              cursorColor={theme.colors.zippaGrey}
              placeholder={`Enter your password`}
            />
            <EditShowContainer onPress={() => setMaskPassword(!maskPassword)}>
              <Ionicons name={maskPassword ? 'eye-off' : 'eye'} size={22} color={theme.colors.zippaBlack} />
            </EditShowContainer>
          </InputBox>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Link href={'/auth/forgot-password'}>
              <Text style={{ color: theme.colors.zippaBlue, flex: 1, textAlign: 'right', }}>Forgot Password?</Text></Link>
          </View>

          <View>
            <ZippaButton action={handleLogin} text='Login'/>
          </View>

          <Text style={{ marginTop: 20, textAlign: 'center' }}>Don&apos;t have an account? <Link href={'/auth/(register)/signup'}>
            <Text color={theme.colors.zippaGreen} fontFamily='zippa-semibold'>
              Sign up
            </Text>
          </Link>
          </Text>
        </LoginContent>
      </Container>
    </>
  )
}

export default memo(LoginScreen)

const LoginLogoContainer = styled.View`
  flex: 1;
  position: relative;
  align-items: center;
  background-color: ${theme.colors.zippaBlue};
  width: 100%;
  height: 35%;
`;

const LoginLogo = styled.Image`
  align-self: center;
  justify-content: center;
  margin-top: 100px;
  max-width: 80px;
  max-height: 80px;
`;

const LoginContent = styled.View`
  flex: 1;
  width: 100%;
  height: 65%;
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

const Password = styled(Email)``;
