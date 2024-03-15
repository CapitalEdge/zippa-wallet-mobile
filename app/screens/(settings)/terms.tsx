import { Stack } from "expo-router";
import { ScreenContent, Text } from "../../../components/Themed";

export default function Terms() {
    return (
        <>
            <Stack.Screen options={{
                title: 'Terms of usage',
                headerShown: true
            }} />
            <ScreenContent>
                <Text>Our terms and conditions</Text>
            </ScreenContent>
        </>
    )
}