import { theme } from "../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import styled from "styled-components/native";
import { Text } from "./Themed";
import { router } from "expo-router";
import { useUserStore } from "../stores/feature/users";


export default function Banner() {

  const userData = useUserStore(state => state.userData)

  function CompleteSetup(){
    return <BannerCard onPress={() => router.push("/screens/(settings)/kyc-verification")}>
      <BannerContent>
        <MaterialCommunityIcons name="shield-lock" size={52} color={theme.colors.zippaBlue} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text fontFamily='zippa-regular'>Complete account setup</Text>
          <Text fontFamily="zippa-light" fontSize={14}>Update your security settings</Text>
        </View>
      </BannerContent>
    </BannerCard>
  }

  function StartSaving() {
    return <BannerCard onPress={() => router.push("/screens/(tabs)/save")}>
      <BannerContent>
        <MaterialCommunityIcons style={{ alignSelf:  "center"}} name="alarm-check" size={40} color={theme.colors.zippaBlue} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text fontFamily='zippa-regular'>Start saving today</Text>
          <Text fontFamily="zippa-regular" fontSize={12}>Get amazing interests on your savings</Text>
        </View>
        <MaterialCommunityIcons style={{ alignSelf: "center" }} name="arrow-right" size={24} color={theme.colors.zippaBlue} />
      </BannerContent>
    </BannerCard>
  }

  return (
    (userData?.verified ? <StartSaving /> : <CompleteSetup/> )
  )
}


const BannerCard = styled.Pressable`
  flex: 1;
  width: 90%;
  margin: 25px auto; 
  height: 80px;
  max-height: 80px;
  background-color: ${theme.colors.zippaSubtle};
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 5px;
  `

const BannerContent = styled.View`
    flex: 1;
    flex-direction: row;
    width: 100%;
    height: 100%;
    gap: 10px;
`;