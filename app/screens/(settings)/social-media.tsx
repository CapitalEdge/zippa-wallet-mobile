import { Stack } from "expo-router";
import { ScreenContent, Text, theme } from "../../../components/Themed";
import LottieView from 'lottie-react-native';
import { useRef } from "react";
import { View } from "react-native";
import ZippaButton from "../../../components/Button";

export default function SocialMedia() {
    const socialmediaRef = useRef(null)
    return (
        <>
            <Stack.Screen options={{
                title: 'Social media',
                headerShown: true
            }} />
            <ScreenContent>
                <View style={{marginTop: 20}}>
                    <Text fontFamily="zippa-medium" fontSize={20}>We are social</Text>
                    <Text>Like and follow us on all our social media platforms.</Text>
                </View>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <LottieView
                        autoPlay
                        ref={socialmediaRef}
                        style={{
                            width: 300,
                            height: 300,
                        }}
                        source={require('../../../assets/vectors/social-media.json')}
                    />
                </View>
                <View style={{flexDirection: 'column'}}>
                    <ZippaButton color={theme.colors.zippaWhite} textColor={theme.colors.zippaLightBlue} text="Zippa Wallet on Facebook"/>
                    <ZippaButton color={theme.colors.zippaWhite} textColor={theme.colors.zippaPink} text="Zippa Wallet on Instagram"/>
                    <ZippaButton color={theme.colors.zippaWhite} textColor={theme.colors.zippaBlack} text="Zippa Wallet on X"/>
                    <ZippaButton color={theme.colors.zippaWhite} textColor={theme.colors.zippaBlue} text="Zippa Wallet on Tiktok"/>
                </View>
            </ScreenContent>
        </>
    )
}
