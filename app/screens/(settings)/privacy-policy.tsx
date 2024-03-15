import { Stack } from "expo-router";
import { ScreenContent, Text } from "../../../components/Themed";

export default function PrivacyPolicy() {
    return (
        <>
            <Stack.Screen options={{
                title: 'Privacy policy',
                headerShown: true
            }} />
            <ScreenContent>
                <Text>Privacy policy details </Text>
            </ScreenContent>
        </>
    )
}