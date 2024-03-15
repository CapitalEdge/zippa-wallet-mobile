import React, { memo, useCallback, useEffect } from 'react';
import { Stack } from 'expo-router';
import { ScreenContent, Text, theme } from '../../../../../components/Themed';
import { View, FlatList } from 'react-native';
import ZippaButton from '../../../../../components/Button';
import { SheetManager } from 'react-native-actions-sheet';
import { useSavingsStore } from '../../../../../stores/feature/savings';
import { ThriftSavingsCard } from '../../../../../components/cards/ThriftSavingsCard';
import NoDataList from '../../../../../components/NoDataList';
import useFetchQuery from '../../../../../hooks/useFetchQuery';
import { useUserStore } from '../../../../../stores/feature/users';
import { GET_THRIFT_SAVINGS } from '../../../../../helpers/graphQL/queries';
import { ThousandSeparator } from '../../../../../helpers/thousandSeparator';

const ThriftSavings = () => {
    const [savingsType, getSavingsType, getInterestRate] = useSavingsStore(state => [state.savingsType, state.getSavingsType, state.getInterestRate]);
    const user = useUserStore().userData;

    const variables = {
        id: user?.usersCollection?.edges[0]?.node?.id,
        savings_type_id: savingsType?.id
    };
    const { data: thriftSavings, loading } = useFetchQuery(GET_THRIFT_SAVINGS, variables);

    const fetchThriftSavingsOptions = useCallback(() => {
        getSavingsType("thrift-savings");
        getInterestRate("thrift-savings");
    }, [savingsType?.id]);

    useEffect(() => {
        fetchThriftSavingsOptions();
    }, [thriftSavings?.savingsCollection?.edges?.length]);

    const RenderThriftList = () => {
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={thriftSavings?.savingsCollection?.edges}
                renderItem={({ item }) => (
                    <ThriftSavingsCard
                        name={item?.node?.name}
                        amount={ThousandSeparator(item?.node?.amount!)}
                        interest={item?.node?.interest_rate?.rate}
                        frequency={item?.node?.frequency?.name}
                        totalAmount={ThousandSeparator(item?.node?.amount!)}
                        created_at={item?.node?.created_at}
                        data={thriftSavings?.savingsCollection?.edges}
                    />
                )}
                refreshing={true}
                style={{
                    marginBottom: 10,
                }}
            />
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Thrift Savings',
                    animation: 'none',
                    headerShown: true,
                }}
            />
            <ScreenContent>
                <View style={{ height: '15%' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text fontFamily="zippa-semibold">Thrift Savings (1.5% Monthly)</Text>
                    </View>
                    <ZippaButton
                        color={theme.colors.zippaOrange}
                        text='Create a thrift saving'
                        action={() => SheetManager.show("thrift-savings")}
                    />
                </View>
                <View style={{ height: '85%' }}>
                    {!thriftSavings?.savingsCollection?.edges?.length ? (
                        <NoDataList color={theme.colors.zippaOrange} loading={loading} />
                    ) : (
                        <RenderThriftList />
                    )}
                </View>
            </ScreenContent>
        </>
    );
};

export default memo(ThriftSavings);
