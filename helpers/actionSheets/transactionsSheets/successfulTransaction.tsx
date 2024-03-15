import { Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { Feather } from "@expo/vector-icons";

export default function SuccessfulTransaction(props: SheetProps<{ value: string }>) {
    const data = JSON.parse(props.payload?.value!);

    return (
        <SheetWrapper sheetName="successful-transaction" gestureEnabled={true} hideCloseButton={true}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Feather name="check-circle" size={40} color={theme.colors.zippaGreen} style={{alignSelf: 'center'}} />
                
                
                {/** View for other transactions */}
                {
                    data?.savings_type_name && <View>
                        <Text fontFamily="zippa-medium" style={{ textAlign: 'center' }}>Transaction successful</Text>
                        <Text fontSize={14} fontFamily='zippa-regular' style={{ textAlign: 'center', textTransform: 'capitalize' }}>
                            <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaGreen}>₦{parseFloat(data.amount).toLocaleString('en')}</Text> {data?.name} {data?.savings_type_name.replace(/-/g, ' ')} added</Text>
                    </View>
                }

                {/** View for money transfer transactions */}
                {
                    data?.accountNumber && <View style={{gap: 5}}>
                        <Text fontFamily="zippa-medium" style={{ textAlign: 'center' }}>You sent money</Text>
                        <Text fontSize={14} fontFamily='zippa-regular' style={{ textAlign: 'center', textTransform: 'capitalize' }}>
                            <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaGreen}>₦{parseFloat(data.amount).toLocaleString('en')}</Text> sent to {data?.accountName} via {data?.bankName} - {data?.accountNumber}</Text>
                    </View>
                }

                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} text="Okay" action={() => SheetManager.hide("successful-transaction")} />
                </View>
            </ScrollView>
        </SheetWrapper>
    );
}
