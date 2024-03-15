import { Stack } from 'expo-router';
import { ScreenContent, Text, theme } from '../../../../components/Themed';
import { FlatList, View } from 'react-native';
import ZippaButton from '../../../../components/Button';
import { SheetManager } from 'react-native-actions-sheet';
import { useSavingsStore } from '../../../../stores/feature/savings';
import { SavingsWithBenefitCard } from '../../../../components/cards/SavingsWithBenefitCard';
import { useEffect, useCallback } from 'react';
import NoDataList from '../../../../components/NoDataList';
import { GET_BENEFITS_AND_SMARTKIDDIES_SAVINGS } from '../../../../helpers/graphQL/queries';
import { useUserStore } from '../../../../stores/feature/users';
import useFetchQuery from '../../../../hooks/useFetchQuery';
import { ThousandSeparator } from '../../../../helpers/thousandSeparator';

/**
 * Renders the Smart Kiddies Savings screen.
 */
export default function SmartKiddiesSavings() {
    const [getBenefitSavingsClassById, getSavingsType, savingsType] = useSavingsStore(state => [state.getBenefitSavingsClassById, state.getSavingsType, state.savingsType]);
    const userData = useUserStore().userData;

    const variables = {
        id: userData?.id,
        saving_type_id: parseInt(savingsType?.id)
    };
    const { data: smartKiddiesSavings, loading } = useFetchQuery(GET_BENEFITS_AND_SMARTKIDDIES_SAVINGS, variables);

    const fetchSmartKiddiesSavingsOptions = useCallback(() => {
        getSavingsType("smart-kiddies-savings");
        getBenefitSavingsClassById(parseInt(savingsType?.id));
    }, [savingsType?.id]);

    useEffect(() => {
        fetchSmartKiddiesSavingsOptions();
    }, [smartKiddiesSavings?.savingsCollection?.edges?.length]);

    /**
     * Renders the list of savings with benefits.
     */
    const RenderBenefitList = () => {
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={smartKiddiesSavings?.savingsCollection?.edges}
                renderItem={({ item }) =>
                    <SavingsWithBenefitCard
                        name={item?.node?.name}
                        amount={ThousandSeparator(Number(item?.node?.savings_benefits?.amount!).toFixed(2))}
                        benefitClass={item?.node?.savings_benefits?.name}
                        benefits={item?.node?.savings_benefits?.benefits}
                        dateAdded={item?.node?.created_at}
                        maturityDate={item?.node?.end_date}
                        node={undefined}
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
                    title: 'Smart Kiddies Savings',
                    animation: 'none',
                    headerShown: true,
                }}
            />
            <ScreenContent>
                <View style={{ height: '15%' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text fontFamily="zippa-semibold">Smart kiddies savings</Text>
                    </View>
                    <ZippaButton
                        color={theme.colors.zippaViolet}
                        text='Create a smart kiddies saving'
                        action={() => SheetManager.show("smart-kiddies-savings")}
                    />
                </View>
                <View style={{ height: '85%' }}>
                    {!smartKiddiesSavings?.savingsCollection?.edges?.length ? (
                        <NoDataList color={theme.colors.zippaViolet} loading={loading} />
                    ) : (
                        <RenderBenefitList />
                    )}
                </View>
            </ScreenContent>
        </>
    );
}