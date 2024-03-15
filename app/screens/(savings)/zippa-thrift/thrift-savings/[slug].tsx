import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { Input, InputBox, NairaSign, ScreenContent, Text, theme } from '../../../../../components/Themed';
import ZippaButton from '../../../../../components/Button';
import ThriftTransactions from '../../../../../components/ThriftTransaction';
import Toast from 'react-native-simple-toast';
import { useSavingsStore } from '../../../../../stores/feature/savings';
import { useUserStore } from '../../../../../stores/feature/users';
import { useGlobalStore } from '../../../../../stores/store';
import { GET_THRIFT_TOPUP } from '../../../../../helpers/graphQL/queries';
import moment from 'moment';
import useFetchQuery from '../../../../../hooks/useFetchQuery';
import { ThousandSeparator } from '../../../../../helpers/thousandSeparator';


const Thrifts = () => {
    const data = useGlobalSearchParams();
    const userData = JSON.parse(data.userData as string);
    const [topUpView, setTopUpView] = useState<boolean>(false);
    const [withdrawView, setWithdrawView] = useState<boolean>(false);

    const updateThriftSavings = useSavingsStore(state => state.updateThriftSavings);
    const user = useUserStore().userData;
    const setAppState = useGlobalStore(state => state.setAppState);

    const variables = {
        transaction_details: parseInt(userData.node.id)
    };
    const { data: thrifts } = useFetchQuery(GET_THRIFT_TOPUP, variables)

    const nextPaymentDate = thrifts?.transactionsCollection?.edges.slice(-1).pop().node.transaction_details.end_date;
    const amountPlusInterest = Number(userData.node.total_amount) + (Number(userData.node.amount) * (Number(userData.node.interest_rate.rate) / 100));

    const changeView = (name: string) => {
        switch (name) {
            case "top-up":
                setTopUpView(!topUpView);
                setWithdrawView(false);
                break;
            case "withdraw":
                setWithdrawView(!withdrawView);
                setTopUpView(false);
                break;
            default:
                setWithdrawView(false);
                setTopUpView(false);
                break;
        }
    }

    function TopUpView() {
        const totalAmount = userData.node.amount + userData.node.total_amount;

        const id = userData.node.id;
        const savingsTopUp = {
            user_id: user?.usersCollection?.edges[0]?.node?.id,
            total_amount: parseFloat(totalAmount),
        };

        const handleTopUp = async () => {
            setAppState("LOADING")
            const response = await updateThriftSavings(parseInt(id), savingsTopUp) as any;
            if (response) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `₦${userData.node.amount.toLocaleString()} thrift savings top up`,
                    Toast.LONG,
                    Toast.BOTTOM,
                );

            }
        };
        return (
            <View>
                <InputBox>
                    <Text fontSize={14}>Amount</Text>
                    <Input
                        value={NairaSign() + userData.node.amount}
                        readOnly={true} 
                    />
                </InputBox>
                <ZippaButton text={'Top up savings'} action={handleTopUp}/>
            </View>
        )
    };

    function WithDrawView() {
        return (
            <View>
                <InputBox>
                    <Text fontSize={14}>Amount</Text>
                    <Input
                        placeholder='Enter amount to withdraw'
                        cursorColor='black'
                    />
                </InputBox>
                <ZippaButton text='Withdraw savings' disabled={true} />
            </View>
        )
    };

    function InfoView() {
        return (
            <ThriftTransactions data={thrifts?.transactionsCollection?.edges} />
        )
    };

    return (
        <>
            <Stack.Screen options={{
                title: `${data.title}`,
                animation: 'none', 
                presentation: 'modal',
                headerShown: true, 
            }} />
            <Thriftboard>
                <HalfBoard>
                    <Text fontSize={12}>Initial amount</Text>
                    <Text fontSize={24} fontFamily="zippa-semibold" color={theme.colors.zippaOrange}>{NairaSign()}{ThousandSeparator(userData.node.amount)}</Text>
                    <Text fontSize={14} fontFamily="zippa-light">{userData.node.frequency.name} @ {userData.node.interest_rate.rate}% p/m</Text> 
                    <Text fontSize={12} fontFamily="zippa-medium">Next due: {moment(nextPaymentDate).format("DD MMM, YYYY")}</Text> 
                </HalfBoard>
                <HalfBoard>
                    <Text fontSize={12}>Saved amount</Text>
                    <Text fontSize={24} fontFamily="zippa-semibold" color={theme.colors.zippaOrange}>{NairaSign()}{ThousandSeparator(userData.node.total_amount)}</Text>
                    <Text fontSize={12} fontFamily="zippa-light">Total amount with interest</Text>
                    <Text fontSize={14} fontFamily="zippa-semibold">{NairaSign()}{ThousandSeparator(amountPlusInterest.toFixed(2))}<Text fontSize={16} fontFamily="zippa-light"> </Text></Text>
                </HalfBoard>
            </Thriftboard>

            <ScreenContent>
                <Text fontFamily="zippa-light" fontSize={12} style={{marginTop: 15, backgroundColor: theme.colors.zippaSubtle, padding: 10}}>Note: The top up button becomes active from next payment date up to 48hrs. After this time, this saving becomes inactive. Top up will be unavailable.</Text>
                <ButtonGroup>
                    <View style={{ width: '50%' }}>
                        <ZippaButton text={'Top up'} color={theme.colors.zippaOrange} action={() => changeView('top-up')} disabled={moment(nextPaymentDate) > moment() ? true :
                            moment(nextPaymentDate).add(2, 'd') > moment() ? false : true} />
                    </View>
                    <View style={{ width: '50%' }}>
                        <ZippaButton text={'Withdraw'} textColor={theme.colors.zippaBlack} color={theme.colors.zippaWhite} action={() => changeView('withdraw')} />
                    </View>
                </ButtonGroup>
                {(!topUpView && !withdrawView) && <InfoView />}
                {topUpView && <TopUpView />}
                {withdrawView && <WithDrawView />}
            </ScreenContent>
        </>
    )
}

export default Thrifts;


const Thriftboard = styled.View`
    align-items: center; 
    background-color: ${theme.colors.zippaSubtleOrange}; 
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
    border-right-color: ${theme.colors.zippaOrange}; 
    padding: 10px 20px;
`;

const ButtonGroup = styled.View`
    display: flex; 
    flex-direction: row; 
    max-width: 100%; 
    gap: 10px; 
    justify-content: center;
`;
