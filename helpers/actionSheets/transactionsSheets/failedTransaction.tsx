import { Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { Feather } from "@expo/vector-icons";

export default function FailedTransaction(props: SheetProps<{ value: string }>) {
    const data = JSON.parse(props.payload?.value!);
    return (
        <SheetWrapper sheetName="failed-transaction" gestureEnabled={true} hideCloseButton={true}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Feather name="frown" size={40} color={theme.colors.zippaRed} style={{ alignSelf: 'center' }} />
                <Text fontFamily="zippa-medium" style={{ textAlign: 'center' }}>Transaction failed</Text>

                <Text fontSize={14} fontFamily='zippa-regular' style={{ textAlign: 'center', textTransform: 'capitalize' }}>
                    <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaBlack}>₦{parseFloat(data.amount).toLocaleString('en')}</Text> {data?.name} {data?.savings_type_name.replace(/-/g, ' ')} failed</Text>
                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} text="Okay" action={() => SheetManager.hide("failed-transaction")} />
                </View>
            </ScrollView>
        </SheetWrapper>
    );
}
