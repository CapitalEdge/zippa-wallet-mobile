import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { Input, InputBox, NairaSign, ScreenContent, Text, theme } from '../../../../../components/Themed';
import ZippaButton from '../../../../../components/Button';
import TargetSavingsTransactions from '../../../../../components/TargetSavingsTransaction';
import useFetchQuery from '../../../../../hooks/useFetchQuery';
import { useSavingsStore } from '../../../../../stores/feature/savings';
import { useUserStore } from '../../../../../stores/feature/users';
import { useGlobalStore } from '../../../../../stores/store';
import { GET_THRIFT_TOPUP } from '../../../../../helpers/graphQL/queries';
import { SheetManager } from 'react-native-actions-sheet';
import { ThousandSeparator } from '../../../../../helpers/thousandSeparator';


const TargetSavingsItem = () => {
  const data = useGlobalSearchParams();
  const savingsData = JSON.parse(data.savingsData as string);
  const [topUpView, setTopUpView] = useState<boolean>(false);
  const [withdrawView, setWithdrawView] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');

  const updateThriftSavings = useSavingsStore(state => state.updateThriftSavings);
  const user = useUserStore().userData;
  const setAppState = useGlobalStore(state => state.setAppState);

  const variables = {
    transaction_details: parseInt(savingsData.node.id)
  };
  const { data: thrifts } = useFetchQuery(GET_THRIFT_TOPUP, variables);

  const nextPaymentDate = thrifts?.transactionsCollection?.edges.slice(-1).pop().node.transaction_details.end_date;
  const interestRateInDecimal = (savingsData?.node?.interest_rate?.rate / 100).toFixed(3);
  const amountPlusInterest = Number(savingsData?.node?.total_amount) + (savingsData?.node?.amount * Number(interestRateInDecimal));

  const changeView = (name: string) => {
    switch (name) {
      case 'top-up':
        setTopUpView(!topUpView);
        setWithdrawView(false);
        break;
      default:
        setWithdrawView(false);
        setTopUpView(false);
        break;
    }
  };

  function AddMoneyView() {
    const totalAmount = savingsData.node.amount + savingsData.node.total_amount;

    const id = savingsData.node.id;
    const savingsTopUp = {
      user_id: user?.usersCollection?.edges[0]?.node?.id,
      total_amount: parseFloat(totalAmount),
    };

    const handleTopUp = async () => {
      setAppState('LOADING');
      const response = await updateThriftSavings(parseInt(id), savingsTopUp) as any;
      if (response) {
        SheetManager.show('successful-transaction', {
          payload: {
            value: JSON.stringify({
              amount: amount,
              name: savingsData?.node?.name,
              savings_type_name: 'Top up'
            })
          }
        });
        setAppState('IDLE');
      }
    };

    return (
      <View>
        <InputBox>
          <Text fontSize={14}>Amount</Text>
          <Input
            placeholder="Enter amount to add"
            cursorColor='black'
          />
        </InputBox>
        <ZippaButton text={'Add to fixed savings'} action={handleTopUp} />
      </View>
    );
  }

  function InfoView() {
    return (
      <TargetSavingsTransactions data={thrifts?.transactionsCollection?.edges} />
    );
  }

  return (
    <>
      <Stack.Screen options={{
        title: `${data?.title}`,
        animation: 'none',
        presentation: 'modal',
        headerShown: true,
      }} />
      <Thriftboard>
        <HalfBoard>
          <Text fontSize={12}>Target amount</Text>
          <Text fontSize={26} fontFamily="zippa-semibold" color={theme.colors.zippaLightBlue}><NairaSign />{ThousandSeparator(savingsData?.node?.amount)}</Text>
          <Text fontSize={14} fontFamily="zippa-light">Interest @ {savingsData?.node?.interest_rate?.rate}% p/m</Text>
          <Text fontSize={12} fontFamily="zippa-medium">Target Date: {moment(nextPaymentDate).format('DD MMM, YYYY')}</Text>
        </HalfBoard>
        <HalfBoard>
          <Text fontSize={12}>Saved amount</Text>
          <Text fontSize={26} fontFamily="zippa-semibold" color={theme.colors.zippaLightBlue}><NairaSign />{ThousandSeparator(savingsData?.node?.total_amount)}</Text>
          <Text fontSize={12} fontFamily="zippa-light">Total amount with interest</Text>
          <Text fontSize={16} fontFamily="zippa-semibold"><NairaSign />{ThousandSeparator(``+amountPlusInterest)}<Text fontSize={12} fontFamily="zippa-light"> (with interest).
          </Text>
          </Text>
        </HalfBoard>
      </Thriftboard>

      <ScreenContent>
        <ZippaButton text={'Add money'} color={theme.colors.zippaLightBlue} action={() => changeView('top-up')} />
        {(!topUpView && !withdrawView) && <InfoView />}
        {topUpView && <AddMoneyView />}
      </ScreenContent>
    </>
  );
};

export default TargetSavingsItem;

const Thriftboard = styled.View`
  align-items: center;
  background-color: ${theme.colors.zippaSubtle};
  height: 130px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

const HalfBoard = styled.View`
  width: 50%;
  min-width: 50%;
  height: 100%;
  border-right-width: 2px;
  border-right-color: ${theme.colors.zippaLightBlue};
  padding: 10px 20px;
`;
