import { Stack } from "expo-router";
import {ScreenContent, Text } from "../../../components/Themed";

export default function FAQ() {
  return (
      <>
          <Stack.Screen options={{
        title: 'FAQ',
        headerShown: true
          }} />
          <ScreenContent>
            <Text>Frequently Asked Questions</Text>
          </ScreenContent>
      </>
  )
}