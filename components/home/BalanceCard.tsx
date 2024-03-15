import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native';
import { CardProps } from '../../helpers/types';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { NairaSign, Text, theme } from '../Themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { GET_ALL_SAVINGS } from '../../helpers/graphQL/queries';
import { useUserStore } from '../../stores/feature/users';
import { MMKVStorage } from '../../stores/mmkv-storage';
import { useQuery } from '@apollo/client';
import * as Clipboard from 'expo-clipboard';
import { ThousandSeparator } from '../../helpers/thousandSeparator';


export default function BalanceCard() {
  const userData = useUserStore(state => state.userData)
  const userId = userData?.id;
  const [showCount, setShowCount] = useState<boolean>(false);
  const [showMoney, setShowMoney] = useState<boolean>(false);
  const [color, setColor] = useState(false)
  
  const copyToClipboard = async (value: string) => {
    setColor(true)
    await Clipboard.setStringAsync(value);
  };
  
  useEffect(() => {
    setTimeout(() => {
      setColor(false)
    }, 1000)

  }, [color])


  const { data: allSavings } = useQuery(GET_ALL_SAVINGS, { variables: { user_id: userId }, fetchPolicy: 'cache-and-network' });

  const getSavingsTypeCount = (savingType: string) => {
    return allSavings?.savingsCollection?.edges.filter((edge: { node: { savings_type: { name: string; }; }; }) => edge.node.savings_type.name === savingType).length;
  };

  const zippaTargetCount = getSavingsTypeCount('target-savings');
  const zippaThriftCount = getSavingsTypeCount('thrift-savings');

  const zippaBenefitSavingsCount = getSavingsTypeCount('savings-with-benefits');
  const zippaSmartKiddiesCount = getSavingsTypeCount('smart-kiddies-savings');
  const zippaFixedDepositCount = getSavingsTypeCount('fixed-deposit-savings');

  const zippaLockCount = zippaFixedDepositCount + zippaSmartKiddiesCount + zippaBenefitSavingsCount;

  const totalSavingsCount = zippaLockCount + zippaTargetCount + zippaThriftCount;
  MMKVStorage.setItem("@savings-count", JSON.stringify({ zippaTargetCount, zippaThriftCount, zippaLockCount }));

  return (
    <CardContainer horizontal showsHorizontalScrollIndicator={false}>
      <Card>
        <View>
          <Text color='white' fontFamily='zippa-bold'>Wallet</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text color='white' fontFamily='zippa-light' fontSize={14}>Total Bal</Text>
            <Pressable onPress={() => setShowMoney(!showMoney)}>
              {showMoney ? <Ionicons name="ios-eye" size={20} color={theme.colors.zippaLight} /> : <Ionicons name="ios-eye-off" size={20} color={theme.colors.zippaLight} />}
            </Pressable>
          </View>
          <Text color='white' fontFamily='zippa-semibold' fontSize={24} style={{ textAlign: 'center', marginTop: 10 }}>
            {showMoney ? `${NairaSign()}${userData?.wallet_balance ? ThousandSeparator(Number(userData?.wallet_balance).toFixed(2)) : "0.00" }` : "****"}
          </Text>
          {userData?.account_number ? <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column', }}>
                <Text color='white' fontSize={10} fontFamily='zippa-light'>{JSON.parse(userData.bank_details)?.bankName}</Text>
                <Text color='white' fontSize={14} fontFamily='zippa-light'>{!showMoney ? `****${userData?.account_number.slice(4)}` : userData?.account_number}</Text>
            </View>
            <Pressable onPress={() => copyToClipboard(userData?.account_number)}>
              <Ionicons name="ios-copy" size={18} color={color ? theme.colors.zippaGreen : theme.colors.zippaLight} style={{ marginTop: 10 }} />
            </Pressable>
          </View> : <View>
              <Text fontSize={12} color={theme.colors.zippaLight}>Complete account setup to get your ZPW account number</Text> 
          </View>
          }
        </View>
      </Card>

      <Card backgroundColor={theme.colors.zippaGreen}>
        <View>
          <Text color='white' fontFamily='zippa-bold'>Savings</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text color='white' fontFamily='zippa-light' fontSize={14}>Total count</Text>
            <Pressable onPress={() => setShowCount(!showCount)}>
              {showCount ? <Ionicons name="ios-eye" size={20} color="white" /> : <Ionicons name="ios-eye-off" size={20} color="white" />}
            </Pressable>
            
          </View>
          <Text color='white' fontFamily='zippa-semibold' fontSize={24} style={{ textAlign: 'center', marginTop: 10 }}>
            {showCount ? totalSavingsCount : "***"} Active
          </Text>

          <Pressable onPress={() => router.push('/screens/(tabs)/save')} style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', backgroundColor: theme.colors.zippaBlue, borderRadius: 10, width: 120, paddingVertical: 5, alignSelf: 'center' }}>
            <Text color='white' fontFamily='zippa-light' fontSize={12}>View all plans</Text>
          </Pressable>
        </View>
      </Card>
{/* 
      <Card backgroundColor={theme.colors.zippaGrey}>
        <View>
          <Text color='white' fontFamily='zippa-bold'>Loans</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text color='white' fontFamily='zippa-light' fontSize={14}>Credit Limit</Text>
            <Ionicons name="ios-eye-off" size={20} color="white" />
          </View>
          <Text color='white' fontFamily='zippa-semibold' fontSize={28} style={{ textAlign: 'center', marginTop: 10 }}>
            unavailable
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', backgroundColor: theme.colors.zippaBlue, borderRadius: 10, width: 120, paddingVertical: 5, alignSelf: 'center' }}>
            <Text color='white' fontFamily='zippa-light' fontSize={12}>Coming soon!</Text>
          </View>
        </View>
      </Card> */}
    </CardContainer>
  )
}


const Card = styled.View<CardProps>`
  width: 220px;
  height: 200px;
  margin-right: 15px;
  border-radius: 25px;
  padding: 20px;
  color: ${(props: { color: string; }) => props.color || theme.colors.zippaLight};
  flex: 1;
  background-color: ${(props: { backgroundColor: string; }) => props.backgroundColor || theme.colors.zippaBlue};
`

const CardContainer = styled.ScrollView`
  width: 100%;
  max-height: 220px;
  padding-left: 5%;
  margin-top: 20px
`