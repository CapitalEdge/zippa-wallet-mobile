import { View, FlatList } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { Stack } from 'expo-router';
import { ScreenContent, theme, Text } from '../../../../../components/Themed';
import ZippaButton from '../../../../../components/Button';
import NoDataList from '../../../../../components/NoDataList';
import { SheetManager } from 'react-native-actions-sheet';
import { useSavingsStore } from '../../../../../stores/feature/savings';
import { TargetSavingsCard } from '../../../../../components/cards/TargetSavingsCard';
import { GET_TARGET_SAVINGS } from '../../../../../helpers/graphQL/queries';
import { useUserStore } from '../../../../../stores/feature/users';
import useFetchQuery from '../../../../../hooks/useFetchQuery';
import { ThousandSeparator } from '../../../../../helpers/thousandSeparator';

/**
 * Renders the Target Savings screen.
 */
const TargetSavings = () => {
    const [getSavingsMode, getSavingsType, savingsType, getInterestRate] = useSavingsStore(state => [
        state.getSavingsMode,
        state.getSavingsType,
        state.savingsType,
        state.getInterestRate,
    ]);

    const userData = useUserStore().userData;

    const variables = {
        id: userData?.id,
        savings_type_id: parseInt(savingsType?.id)
    };
    const { data: targetSavings, loading } = useFetchQuery(GET_TARGET_SAVINGS, variables);

    const fetchTargetSavingsOptions = useCallback(() => {
        getSavingsMode();
        getSavingsType('target-savings');
        getInterestRate('target-savings');
    }, [savingsType?.id]);

    useEffect(() => {
        fetchTargetSavingsOptions();
    }, [targetSavings?.savingsCollection?.edges?.length]);

    const RenderTargetSavings = () => {
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={targetSavings?.savingsCollection?.edges}
                renderItem={({ item }) =>
                    <TargetSavingsCard
                        name={item?.node?.name}
                        amount={ThousandSeparator(item?.node?.amount!)}
                        savings_mode={item?.node?.savings_mode?.key}
                        term={item?.node?.term}
                        total_amount={ThousandSeparator(item?.node?.total_amount!)}
                        created_at={item?.node?.created_at}
                        end_date={item?.node?.end_date}
                        frequency={item?.node?.frequency?.id}
                        data={targetSavings?.savingsCollection?.edges}
                    />
                }
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
                    title: 'Target Savings',
                    animation: 'none',
                    headerShown: true,
                }}
            />
            <ScreenContent>
                <View style={{ height: '20%' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text fontFamily="zippa-semibold">Zippa target savings (1.8% Monthly)</Text>
                        <Text fontSize={14} fontFamily="zippa-light">Save towards a goal</Text>
                    </View>
                    <ZippaButton
                        color={theme.colors.zippaLightBlue}
                        text='Create a target saving'
                        action={() => SheetManager.show("target-savings")}
                    />
                </View>
                <View style={{ height: '80%' }}>
                    {!targetSavings?.savingsCollection?.edges?.length ? (
                        <NoDataList color={theme.colors.zippaLightBlue} loading={loading} />
                    ) : (
                        <RenderTargetSavings />
                    )}
                </View>
            </ScreenContent>
        </>
    );
};

export default TargetSavings;