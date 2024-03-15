import { ActivityIndicator, Image, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Container, Text } from '../../../components/Themed'
import { theme } from '../../../constants/Colors'
import LottieView from 'lottie-react-native';
import { Stack, router } from 'expo-router';
import { MMKVStorage } from '../../../stores/mmkv-storage';
import { useAuthStore } from '../../../stores/feature/auth';
import { useUserStore } from '../../../stores/feature/users';


export default function Congratulations() {
  const authData = useAuthStore(state => state.data);
  const getUserData = useUserStore(state => state.getUserData);

  const animation = useRef(null);
  const firstname = MMKVStorage.getItem("@firstname") as string

  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true)
    const initialiseUser = async () => {
      setLoading(false);
      getUserData(authData?.user?.id);
      setTimeout(() => {
        router.replace('/screens/(tabs)/home');
      }, 1000)
    };
    initialiseUser();
  }, []);
  

  function AccountSetup() {
    return (
      <>
        {loading ? <View style={{paddingTop: 50}}>
          <ActivityIndicator size={28} color={theme.colors.zippaGreen} />
          <Text fontSize={14} color={theme.colors.zippaLight}>Finishing account setup</Text>
        </View> : <View style={{ paddingTop: 50 }}>
            <Text fontSize={14} color={theme.colors.zippaLight}>Setup complete</Text>
        </View>}
      </>
    )
  }

  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
      }} />
      <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.zippaBlue }}>
        <Text fontSize={16} fontFamily='zippa-semibold' color={theme.colors.zippaWhite} style={{ textAlign: 'center', position: 'absolute', top: 150 }}>Welcome to Zippa Wallet</Text>
        <Image source={require('../../../assets/images/zippa-icon.png')} style={{ width: 120, height: 120, position: 'absolute', top: 200 }} />
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 250,
            height: 250,
          }}
          source={require('../../../assets/vectors/animation_ll85df74.json')}
        />
        <Text fontSize={22} fontFamily='zippa-semibold' color={theme.colors.zippaWhite} style={{ textAlign: 'center' }}>Congratulations {firstname}!</Text>
        <Text color={theme.colors.zippaLight} fontSize={14}>You're registration is successful!</Text>
        <AccountSetup />
      </Container>
    </>
  )
}