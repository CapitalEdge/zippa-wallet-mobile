import moment from "moment";
import { View } from "react-native";
import {iSavingWithBenefitData } from "../../helpers/types";
import { SavingsDataCard, theme, Text, NairaSign } from "../Themed";

export const SavingsWithBenefitCard = ({ amount, benefitClass, benefits, dateAdded, maturityDate, name }: iSavingWithBenefitData): JSX.Element => {
    return (
        <SavingsDataCard backgroundColor={theme.colors.zippaSubtleViolet} border={theme.colors.zippaViolet}>
            <Text color={theme.colors.zippaViolet} fontFamily="zippa-semibold">{name}</Text>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{width: "50%"}}>
                        <Text fontSize={14} fontFamily="zippa-regular">Amount: {NairaSign()}{amount}</Text>
                        <Text fontSize={14} fontFamily="zippa-regular">Savings plan: {benefitClass}</Text>
                        <Text fontSize={14} fontFamily="zippa-regular">Term: 1 year</Text>
                    </View>
                    <View>
                        <Text color={theme.colors.zippaViolet} fontSize={12} fontFamily="zippa-semibold">Amount receivable</Text>
                        <Text color={theme.colors.zippaViolet} fontSize={20} fontFamily="zippa-semibold">{NairaSign()}{amount}</Text>
                    </View>
                </View>
                <View style={{width: "100%"}}>
                    <Text fontSize={14} fontFamily="zippa-regular" >Benefits: <Text color={theme.colors.zippaViolet} fontSize={12} fontFamily="zippa-medium">{benefits}</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text color={theme.colors.zippaBlue} fontFamily="zippa-regular" fontSize={12}>Date: {moment(dateAdded).format("MMM. Do, YYYY.")}</Text>
                    <Text color={theme.colors.zippaViolet} fontFamily="zippa-regular" fontSize={12}>Maturity: {moment(maturityDate).format("MMM. Do, YYYY.")}</Text>
                </View>
            </View>
        </SavingsDataCard>
    );
}