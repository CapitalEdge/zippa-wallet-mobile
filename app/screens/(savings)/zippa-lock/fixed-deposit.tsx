import { Stack } from 'expo-router'
import { NairaSign, ScreenContent, Text, theme } from '../../../../components/Themed'
import { Pressable, View, FlatList } from 'react-native'
import ZippaButton from '../../../../components/Button'
import { SheetManager } from 'react-native-actions-sheet'
import { useCallback, useEffect, useState } from 'react'
import { FixedDepositCard } from '../../../../components/cards/FixedDepositCard'
import lodash from 'lodash'
import { useSavingsStore } from '../../../../stores/feature/savings'
import { useUserStore } from '../../../../stores/feature/users'
import NoDataList from '../../../../components/NoDataList'
import { GET_FIXEDDEPOSIT } from '../../../../helpers/graphQL/queries';
import useFetchQuery from '../../../../hooks/useFetchQuery'
import { ThousandSeparator } from '../../../../helpers/thousandSeparator'

/**
 * Renders the Fixed Deposit screen.
 */
export default function FixedDeposit() {
    const [savingsType, getSavingsType, interestRate, getInterestRate] = useSavingsStore(state => [state.savingsType, state.getSavingsType, state.interestRate, state.getInterestRate]);
    const userData = useUserStore().userData;
    const [balance, setBalance] = useState<number>();
    const [showMoney, setShowMoney] = useState<boolean>(false);

    const [refreshing, setRefreshing] = useState(false);

    const variables = {
        id: userData?.id,
        savings_type_id: parseInt(savingsType?.id)
    }
    const { loading, data: fixedDeposits, refetch } = useFetchQuery(GET_FIXEDDEPOSIT, variables);

    // set up refreshing
    useEffect(() => {
        if (refreshing) {
            refetch();
            setRefreshing(false);
        }
    }, [refreshing]);

    const fetchFixedDepositQueryOptions = useCallback(() => {
        getSavingsType("fixed-deposit-savings");
        getInterestRate("fixed-deposit-savings");
    }, [savingsType.id]);

    const updateBalance = useCallback(() => { 
        //@ts-ignore
        const sumTotal = lodash.sumBy(fixedDeposits?.savingsCollection?.edges, (element) => Number(element?.node?.total_amount!));
        setBalance(sumTotal);
    }, [fixedDeposits?.savingsCollection?.edges?.length]);


    useEffect(() => {
        fetchFixedDepositQueryOptions();
        updateBalance();
    }, [fixedDeposits?.savingsCollection?.edges?.length]);
    
    /**
     * Renders the list of fixed deposits.
     */
    const RenderDepositList = () => (
        <FlatList showsVerticalScrollIndicator={false} data={fixedDeposits?.savingsCollection?.edges}
            renderItem={({ item }) =>
                <FixedDepositCard
                    name={item?.node?.name}
                    amount={ThousandSeparator(item?.node?.amount!)}
                    interest={interestRate?.rate}
                    term={item?.node?.term}
                    total_amount={ThousandSeparator(item?.node?.total_amount!)}
                    created_at={item?.node?.created_at}
                    end_date={item?.node?.end_date}
                />
            }
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
            style={{ marginBottom: 10 }} />
    )
    return (
        <>
            <Stack.Screen options={{
                title: 'Fixed Deposit',
                animation: 'none',
                headerShown: true, 
            }} />
            <ScreenContent>
                <View style={{ height: '25%', minHeight: "25%" }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text fontFamily="zippa-semibold">Fixed Deposit (1.8% Monthly)</Text>
                        <Pressable onPress={() => setShowMoney(!showMoney)}>
                            <Text fontFamily="zippa-semibold" fontSize={30}>{showMoney ? NairaSign() + ThousandSeparator(``+balance?.toFixed(2)) : "******"}</Text>
                        </Pressable>
                        <Text fontSize={10}>Tap money to {!showMoney ? "reveal" : "hide"}</Text>
                    </View>
                    <ZippaButton color={theme.colors.zippaViolet} text='Create a fixed deposit' action={() => SheetManager.show("fixed-deposit-sheet")} />
                </View>
                <View style={{ height: '75%', paddingTop: 0 }}>
                    {!fixedDeposits?.savingsCollection?.edges?.length ? <NoDataList color={theme.colors.zippaViolet} loading={loading} /> : <RenderDepositList />}
                </View>
            </ScreenContent>
        </>
    )
}