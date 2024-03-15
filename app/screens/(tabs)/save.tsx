import { Text } from '../../../components/Themed';
import { theme } from '../../../constants/Colors';
import { FontAwesome, Foundation } from '@expo/vector-icons';
import { CardProps } from '../../../helpers/types';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { router } from 'expo-router';
import { MMKVStorage } from '../../../stores/mmkv-storage';
import { useUserStore } from '../../../stores/feature/users';
import { ThousandSeparator } from '../../../helpers/thousandSeparator';


export default function SavingsScreen() {
  const userData = useUserStore(state => state.userData);
  const savingCount = JSON.parse(MMKVStorage.getItem("@savings-count") as string);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: theme.colors.zippaBlue, minHeight: '20%', paddingHorizontal: '5%', paddingTop: 70, paddingBottom: 10 }}>
        <View style={{ flexDirection: 'column' }}>
          <Text color={theme.colors.zippaLight} fontSize={18} fontFamily="zippa-semibold">Savings</Text>
          <Text color='white' fontFamily='zippa-semibold' fontSize={28} style={{ marginTop: 10 }}>
            ₦{userData?.wallet_balance ? ThousandSeparator(Number(userData?.wallet_balance).toFixed(2)) : "0.00"}
          </Text>
          <Text fontFamily='zippa-light' fontSize={12} color='white'>Wallet balance</Text>
        </View>

        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text color={theme.colors.zippaLight} fontSize={12} fontFamily="zippa-regular">Start saving the little you have</Text>
          <View style={{ backgroundColor: theme.colors.zippaGreen, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 50, width: 150, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
            <Text color="white" fontSize={12}>Control your finances</Text>
          </View>
          <Text fontFamily='zippa-light' fontSize={12} color='white'>Get jaw-dropping interests</Text>
        </View>
      </View>

      <SavingContainer>
        <SavingBox border={theme.colors.zippaLightBlue} onPress={() => router.push('/screens/(savings)/zippa-target/')}>
          <Text fontSize={14} fontFamily='zippa-semibold' color={theme.colors.zippaLightBlue}>Zippa Target</Text>
          
          <ActiveContainer>
            <Foundation name="target-two" size={24} color={theme.colors.zippaLightBlue} />
            <Text fontSize={12} fontFamily='zippa-semibold' color={theme.colors.zippaLightBlue}>{savingCount?.zippaTargetCount} Active</Text>
          </ActiveContainer>
          <Text fontSize={10} fontFamily='zippa-light' color={theme.colors.zippaBlue}>Save toward a particular goal. Don't limit yourself by one goal</Text>
          <Text fontSize={10} fontFamily='zippa-bold' color={theme.colors.zippaBlue}>See details</Text>
        </SavingBox>
        <SavingBox border={theme.colors.zippaViolet} onPress={() => router.push('/screens/(savings)/zippa-lock/')}>
          <Text fontSize={14} fontFamily='zippa-semibold' color={theme.colors.zippaViolet}>Zippa Lock</Text>
          <ActiveContainer>
            <FontAwesome name="lock" size={24} color={theme.colors.zippaViolet} />
            <Text fontSize={12} fontFamily='zippa-semibold' color={theme.colors.zippaViolet}>{savingCount?.zippaLockCount} Active</Text>
          </ActiveContainer>
          <Text fontSize={10} fontFamily='zippa-light' color={theme.colors.zippaBlue}>Lock your money away for a fixed period of time. Feed your focus.</Text>
          <Text fontSize={10} fontFamily='zippa-bold' color={theme.colors.zippaBlue}>See details</Text>
          </SavingBox>
        <SavingBox border={theme.colors.zippaOrange} onPress={() => router.push('/screens/(savings)/zippa-thrift/')}>
          <Text fontSize={14} fontFamily='zippa-semibold' color={theme.colors.zippaOrange}>Zippa Thrift</Text>
          <ActiveContainer>
            <FontAwesome name="child" size={24} color={theme.colors.zippaOrange} />
            <Text fontSize={12} fontFamily='zippa-semibold' color={theme.colors.zippaOrange}>{savingCount?.zippaThriftCount} Active</Text>
          </ActiveContainer>
          <Text fontSize={10} fontFamily='zippa-light' color={theme.colors.zippaBlue}>Save money little by little. Grow your finance.</Text>
          <Text fontSize={10} fontFamily='zippa-bold' color={theme.colors.zippaBlue}>See details</Text>
        </SavingBox>

        {/* <SavingBox border={theme.colors.zippaGreen}>
          <Text fontSize={14} fontFamily='zippa-semibold' color={theme.colors.zippaGreen}>Premium Savings</Text>
          <FontAwesome5 name="parking" size={24} color={theme.colors.zippaGreen} />
          <Text fontSize={10} fontFamily='zippa-light' color={theme.colors.zippaBlue}>Save toward a particular goal. Don't limit yourself by one goal</Text>
          <Text fontSize={10} fontFamily='zippa-bold' color={theme.colors.zippaBlue}>See details</Text>
          </SavingBox> */}

      </SavingContainer>

    </ScrollView>
  );
}


const SavingContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  width: 100%;
  height: 100%;
  padding: 0 5%;
  padding-bottom: 50px;
`;

const SavingBox = styled.Pressable<CardProps>`
  height: 200px;
  width: 47%;
  border-radius: 15px;
  backgroundColor: ${(props: { backgroundColor: string; }) => props.backgroundColor || theme.colors.zippaWhite};
  border: 1px solid ${(props: { border: string; }) => props.border || theme.colors.zippaGrey};
  padding: 15px;
  gap: 10px;
`;

const ActiveContainer = styled.View`
  flexDirection: row;
  justifyContent: space-between;
`
