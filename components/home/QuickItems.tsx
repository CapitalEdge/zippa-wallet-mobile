import React from 'react'
import { theme } from '../../constants/Colors'
import { CardProps } from '../../helpers/types'
import styled from 'styled-components/native'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text } from '../../components/Themed'
import { SheetManager } from 'react-native-actions-sheet';
import { router } from 'expo-router';
import { useToggleStore } from '../../stores/feature/toggle';

export default function QuickItems() {
  const [modalVisible, toggleModalVisible] = useToggleStore(state => [state.modalVisible, state.toggleModalVisible]);
  
  return (
    <QuickItemsContainer horizontal showsHorizontalScrollIndicator={false}>

      <QuickItem onPress={() => SheetManager.show('topup-wallet')}>
        <QuickItemIcon>
          <Ionicons name="ios-wallet" size={24} color={theme.colors.zippaSubtle} style={{ position: 'relative', alignContent: 'center' }} />
        </QuickItemIcon>
        <Text color={theme.colors.zippaBlack} fontSize={12} fontFamily='zippa-semibold'>Top-up wallet</Text>
      </QuickItem>
      <QuickItem onPress={() => router.push('/screens/(bills-and-data)/bill-and-data')}>
        <QuickItemIcon>
          <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={theme.colors.zippaSubtle} style={{ position: 'relative', alignContent: 'center' }} />
        </QuickItemIcon>
        <Text color={theme.colors.zippaBlack} fontSize={12} fontFamily='zippa-semibold'>Bills & data</Text>
      </QuickItem>
      <QuickItem onPress={() => SheetManager.show('coming-soon')}>
        <QuickItemIcon>
          <Ionicons name="paper-plane-sharp" size={24} color={theme.colors.zippaSubtle} style={{ position: 'relative', alignContent: 'center' }} />
        </QuickItemIcon>
        <Text color={theme.colors.zippaBlack} fontSize={12} fontFamily='zippa-semibold'>Withdrawal</Text>
      </QuickItem>
      <QuickItem onPress={() => toggleModalVisible(!modalVisible)}>
        <QuickItemIcon>
          <MaterialIcons name="support-agent" size={24} color={theme.colors.zippaSubtle} style={{ position: 'relative', alignContent: 'center' }} />
        </QuickItemIcon>
        <Text color={theme.colors.zippaBlack} fontSize={12} fontFamily='zippa-semibold'>Support</Text>
      </QuickItem>
    </QuickItemsContainer>
  )
}

const QuickItemsContainer = styled.ScrollView`
  width: 100%;
  max-height: 140px;
  padding-left: 5%;
  background-color: ${theme.colors.zippaLight};
`


const QuickItem = styled.Pressable<CardProps>`
  width: 100%;
  min-width: 120px;
  height: 120px;
  margin-right: 15px;
  border-radius: 25px;
  color: ${(props: { color: string; }) => props.color || theme.colors.zippaLight};
  background-color: white;
  flex: 1;
  padding: 15px;
  gap: 10px;
`

const QuickItemIcon = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.zippaBlue};
  border-radius: 50px;
  width: 40px;
  max-height: 40px;
  position: relative;
  margin-top: 20px;
  `
