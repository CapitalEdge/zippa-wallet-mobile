import moment from "moment";
import { View } from "react-native";
import { iThriftSavingsData } from "../../helpers/types";
import { SavingsDataCard, theme, Text, NairaSign } from "../Themed";
import { Link } from "expo-router";
import { Slugify } from "../../helpers/slugify";
import { ThousandSeparator } from "../../helpers/thousandSeparator";

export const ThriftSavingsCard = ({
    name,
    amount,
    interest,
    frequency,
    totalAmount,
    created_at,
    data }: iThriftSavingsData) => {
    //data passed through the link param for dynamic usage.
    const filteredData = data?.find(item => item.node.name === name);
    const stringifiedData = JSON.stringify(filteredData);

    return (
        <SavingsDataCard backgroundColor={theme.colors.zippaSubtleOrange} border={theme.colors.zippaOrange}>
            <Text color={theme.colors.zippaOrange} fontFamily="zippa-semibold">{name ? name : "Zippa Thrift Savings"}</Text>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text fontSize={14} fontFamily="zippa-regular">Amount: {NairaSign()}{amount}</Text> 
                        <Text fontSize={14} fontFamily="zippa-regular">Interest rate: {interest}%</Text>
                        <Text fontSize={14} fontFamily="zippa-regular">Frequency: {frequency}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: -10 }}>
                        <Text color={theme.colors.zippaOrange} fontSize={20} fontFamily="zippa-semibold">₦{totalAmount}</Text>
                        <Text color={theme.colors.zippaOrange} fontSize={14} fontFamily="zippa-semibold">{frequency}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text color={theme.colors.zippaBlue} fontFamily="zippa-regular" fontSize={12}>Date: {moment(created_at).format("MMM DD, YYYY.")}</Text>
                    <Link href={{
                        pathname: "/screens/(savings)/zippa-thrift/thrift-savings/[slug]",
                        params: { title: name!, slug: Slugify(name!).toLowerCase(), userData: stringifiedData }
                    }} style={{ paddingHorizontal: 25, paddingVertical: 5, backgroundColor: theme.colors.zippaOrange, borderRadius: 5 }}>
                        <Text color={theme.colors.zippaLight} fontFamily="zippa-medium" fontSize={10}>Manage</Text>
                    </Link>
                </View>
            </View>
        </SavingsDataCard>
    );
}