import moment from "moment";
import { View } from "react-native";
import { iSmartKiddiesSavingsData } from "../../helpers/types";
import { SavingsDataCard, theme, Text } from "../Themed";

export const SmartKiddiesSavingsCard = ({ savingsAmount, smartKiddiesClass, incentives, dateAdded, maturityDate }: iSmartKiddiesSavingsData) => {
    return (
        <SavingsDataCard backgroundColor={theme.colors.zippaSubtleViolet} border={theme.colors.zippaViolet}>
            <Text color={theme.colors.zippaViolet} fontFamily="zippa-semibold">{smartKiddiesClass} Kiddies Savings</Text>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text fontSize={14} fontFamily="zippa-regular">Amount: ₦{savingsAmount}</Text>
                        <Text fontSize={14} fontFamily="zippa-regular">Incentive class: {smartKiddiesClass}</Text>
                        <Text fontSize={14} fontFamily="zippa-regular">Term: 1 year</Text>
                        <Text fontSize={14} fontFamily="zippa-regular">Incentives: {incentives}</Text>
                    </View>
                    <View>
                        <Text color={theme.colors.zippaViolet} fontSize={24} fontFamily="zippa-semibold">₦{savingsAmount}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text color={theme.colors.zippaBlue} fontFamily="zippa-regular" fontSize={12}>Date: {moment(dateAdded).format("MMM. Do, YYYY.")}</Text>
                    <Text color={theme.colors.zippaViolet} fontFamily="zippa-regular" fontSize={12}>Maturity: {moment(maturityDate).format("MMM. Do, YYYY.")}</Text>
                </View>
            </View>
        </SavingsDataCard>
    );
}