import moment from "moment";
import { View } from "react-native";
import { iFixedDepositData } from "../../helpers/types";
import { SavingsDataCard, theme, Text, NairaSign } from "../Themed";

export const FixedDepositCard = ({ name, amount, interest, term, total_amount, created_at, end_date }: iFixedDepositData):JSX.Element => {
    return (
        <SavingsDataCard backgroundColor={theme.colors.zippaSubtleViolet} border={theme.colors.zippaViolet}>
            <Text color={theme.colors.zippaViolet} fontFamily="zippa-semibold">{name}</Text>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text fontSize={14} fontFamily="zippa-regular">Amount: {NairaSign()}{amount}</Text>
                        <Text fontSize={14} fontFamily="zippa-regular">Interest rate: {interest}%</Text>
                        <Text fontSize={14} fontFamily="zippa-regular">Term: {term} month(s)</Text>
                    </View> 
                    <View>
                        <Text color={theme.colors.zippaViolet} fontSize={12} fontFamily="zippa-semibold">Amount + Interest</Text>
                        <Text color={theme.colors.zippaViolet} fontSize={20} fontFamily="zippa-semibold"> {NairaSign()}{total_amount}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text color={theme.colors.zippaBlue} fontFamily="zippa-regular" fontSize={12}>Date: {moment(created_at).format("MMM. Do, YYYY.")}</Text>
                    <Text color={theme.colors.zippaViolet} fontFamily="zippa-regular" fontSize={12}>Maturity: {moment(end_date).format("MMM. Do, YYYY.")}</Text>
                </View>
            </View>
        </SavingsDataCard>
    );
}