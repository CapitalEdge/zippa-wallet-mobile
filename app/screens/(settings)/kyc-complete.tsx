import React, { useCallback, useEffect, useState } from 'react';
import { Stack, router, useNavigation } from 'expo-router';
import { View } from 'react-native';
import { ScreenContent, Text, theme } from '../../../components/Themed';
import { useUserStore } from '../../../stores/feature/users';
import { FontAwesome5 } from '@expo/vector-icons';
import ZippaButton from '../../../components/Button';


export default function KycVerificationComplete() {

    const [userData, getUserData] = useUserStore(state => [state.userData, state.getUserData]);
    const focused = useNavigation().isFocused();
    const [loading, setLoading] = useState(false);
    
    const refetchData = useCallback(async () => {
        setLoading(true)
        await getUserData(userData?.id)
        setLoading(false)
    }, [userData]);
    
    useEffect(() => {
        focused && refetchData();
    }, [])
    return (
        <>
            <Stack.Screen
                options={{
                    title: "Verification Complete",
                    headerShown: false
                }} />
            <ScreenContent style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 50}}>
                <View style={{ marginTop: 100 }}>
                    <Text>KYC Verified</Text>
                </View>
                <View>
                    <FontAwesome5 name='check' size={52} color={theme.colors.zippaGreen} style={{
                        alignSelf: 'center', padding: 20, backgroundColor: theme.colors.zippaSubtleGreen, borderRadius: 50,
                    }} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text>Thanks for verifying your identity</Text>
                </View>
                <View>
                    {!loading && <ZippaButton text={'Continue'} action={() => router.push('/screens/(tabs)/home')}/>} 
                </View>
            </ScreenContent>
        </>
    );
}

