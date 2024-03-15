import moment from "moment";
import { View } from "react-native";
import { iTargetSavingsData } from "../../helpers/types";
import { SavingsDataCard, theme, Text, NairaSign } from "../Themed";
import { Link } from "expo-router";
import { Slugify } from "../../helpers/slugify";

export const TargetSavingsCard = ({ name, amount, term, total_amount, created_at, end_date, savings_mode, frequency, data }: iTargetSavingsData) => {
    const filteredData = data?.find(item => item?.node?.name === name);
    const stringifiedData = JSON.stringify(filteredData);

    return (
        <SavingsDataCard backgroundColor={theme.colors.zippaSubtle} border={theme.colors.zippaLightBlue}>
            <Text color={theme.colors.zippaLightBlue} fontFamily="zippa-semibold">{name}</Text>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text fontSize={14} fontFamily="zippa-regular">Target: ₦{amount}</Text>
                        <Text fontSize={14} fontFamily="zippa-regular" style={{textTransform: 'capitalize'}}>Savings mode: {savings_mode}</Text>
                        <Text fontSize={14} fontFamily="zippa-regular">Term: {term} month(s)</Text>
                    </View>
                    <View>
                        <Text color={theme.colors.zippaLightBlue} fontSize={12} fontFamily="zippa-semibold">Saved amount</Text>
                        <Text color={theme.colors.zippaLightBlue} fontSize={20} fontFamily="zippa-semibold">{NairaSign()}{total_amount}</Text>
                        {!frequency && <Link href={{
                            pathname: "/screens/(savings)/zippa-target/target-savings/[slug]",
                            params: { title: name!, slug: Slugify(name!).toLowerCase(), savingsData: stringifiedData }
                        }} style={{ paddingHorizontal: 25, paddingVertical: 5, backgroundColor: theme.colors.zippaLightBlue, borderRadius: 5, marginBottom: 5, textAlign: "center"}}>
                            <Text color={theme.colors.zippaLight} fontFamily="zippa-medium" fontSize={10}>Manage</Text>
                        </Link>}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text color={theme.colors.zippaBlue} fontFamily="zippa-regular" fontSize={12}>Date: {moment(created_at).format("MMM. Do, YYYY")}</Text>
                    <Text color={theme.colors.zippaLightBlue} fontFamily="zippa-regular" fontSize={12}>Maturity: {moment(end_date).format("MMM. Do, YYYY")}</Text>
                </View>
                
            </View>
        </SavingsDataCard>
    );
}