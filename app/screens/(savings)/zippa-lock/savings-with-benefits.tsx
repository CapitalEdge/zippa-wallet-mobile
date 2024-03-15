import { Stack } from 'expo-router';
import { ScreenContent, Text, theme } from '../../../../components/Themed';
import { FlatList, View } from 'react-native';
import ZippaButton from '../../../../components/Button';
import { SheetManager } from 'react-native-actions-sheet';
import React, { useEffect, useCallback, useState } from 'react';
import { useSavingsStore } from '../../../../stores/feature/savings';
import { SavingsWithBenefitCard } from '../../../../components/cards/SavingsWithBenefitCard';
import { useUserStore } from '../../../../stores/feature/users';
import { GET_BENEFITS_AND_SMARTKIDDIES_SAVINGS } from '../../../../helpers/graphQL/queries';
import NoDataList from '../../../../components/NoDataList';
import useFetchQuery from '../../../../hooks/useFetchQuery';
import { ThousandSeparator } from '../../../../helpers/thousandSeparator';

/**
 * Renders the Savings With Benefits screen.
 */
export default function SavingWithBenefits() {
    const [getBenefitSavingsClassById, getSavingsType, savingsType] = useSavingsStore(state => [state.getBenefitSavingsClassById, state.getSavingsType, state.savingsType]);

    const [refreshing, setRefreshing] = useState(false);
    const userData = useUserStore().userData;

    const variables = {
        id: userData?.id,
        saving_type_id: parseInt(savingsType?.id)
    };
    const { data: benefitSavings, loading, refetch } = useFetchQuery(GET_BENEFITS_AND_SMARTKIDDIES_SAVINGS, variables);

    // set up refreshing
    useEffect(() => {
        if (refreshing) {
            refetch();
            setRefreshing(false);
        }
    }, [refreshing]);

    const fetchSavingsWithBenefitsQueryOptions = useCallback(() => {
        getSavingsType("savings-with-benefits");
        getBenefitSavingsClassById(parseInt(savingsType?.id));
    }, [savingsType?.id]);

    useEffect(() => {
        fetchSavingsWithBenefitsQueryOptions();
    }, [benefitSavings?.savingsCollection?.edges?.length]);


    const RenderBenefitList = () => {
        return (
            <FlatList showsVerticalScrollIndicator={false} data={benefitSavings?.savingsCollection?.edges}
                renderItem={({ item }) =>
                    <SavingsWithBenefitCard
                        name={item?.node?.name}
                        amount={ThousandSeparator(Number(item?.node?.savings_benefits?.amount).toFixed(2))}
                        benefitClass={item?.node?.savings_benefits?.name}
                        benefits={item?.node?.savings_benefits?.benefits}
                        dateAdded={item?.node?.created_at}
                        maturityDate={item?.node?.end_date} node={undefined} />
                }
                refreshing={refreshing}
                onRefresh={() => setRefreshing(true)}
                style={{
                    marginBottom: 10,
                }} />
        )
    }

    return (
        <>
            <Stack.Screen options={{
                title: 'Savings With Benefits',
                animation: 'none',
                headerShown: true, 
            }} />
            <ScreenContent>
                <View style={{ height: '15%' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text fontFamily="zippa-semibold">Savings with Benefits</Text>
                    </View>
                    <ZippaButton color={theme.colors.zippaViolet} text='Create a benefit saving' action={() => SheetManager.show("savings-with-benefits")} />
                </View>
                <View style={{ height: '85%' }}>
                    {!benefitSavings?.savingsCollection?.edges?.length ? <NoDataList color={theme.colors.zippaViolet} loading={loading} /> : <RenderBenefitList />}
                </View>
            </ScreenContent>
        </>
    )
}