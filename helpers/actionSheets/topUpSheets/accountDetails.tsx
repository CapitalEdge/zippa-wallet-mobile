import { Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { Pressable, ScrollView, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../../stores/feature/users";
import { router } from "expo-router";

export default function AccountDetails() {

    const userData = useUserStore(state => state.userData);
    return (
        <SheetWrapper sheetName="topup-wallet" gestureEnabled={true} hideCloseButton={true}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Ionicons name="ios-wallet" size={30} color={theme.colors.zippaBlack} style={{ position: 'relative', alignContent: 'center', alignSelf: 'center' }} /> 
                <Text fontFamily="zippa-medium" style={{ textAlign: 'center', marginVertical: 10 }}>Wallet Top-up</Text>
                <Text fontFamily="zippa-regular" fontSize={14} color={theme.colors.zippaGreen}>Add funds to your zippa wallet account by paying directly into the following account</Text>
                <View style={{marginVertical: 10}}>
                    <Text fontFamily="zippa-regular" fontSize={14}><Text fontFamily="zippa-regular" fontSize={14} style={{color: theme.colors.zippaGrey}}>Bank name:</Text> {JSON.parse(userData?.bank_details)?.bankName}</Text>
                    <Text fontFamily="zippa-regular" fontSize={14}><Text fontFamily="zippa-regular" fontSize={14} style={{ color: theme.colors.zippaGrey }}>Account name:</Text> {JSON.parse(userData?.bank_details)?.accountName}</Text>
                    <Text fontFamily="zippa-regular" fontSize={14}><Text fontFamily="zippa-regular" fontSize={14} style={{ color: theme.colors.zippaGrey }}>Account number:</Text> {JSON.parse(userData?.bank_details)?.accountNumber}</Text>
                </View>
                <View>
                    <Text fontFamily='zippa-light' fontSize={12} style={{ backgroundColor: theme.colors.zippaWhite, padding: 5, color: theme.colors.zippaBlack, borderRadius: 5, marginVertical: 20 }}>Other payment method</Text>
                    <Pressable disabled style={{ flexDirection: 'row', justifyContent: 'space-between'}} onPress={() => {
                        SheetManager.hide('topup-wallet')
                        router.push('/screens/keypads/funding')
                    }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Ionicons name="card" size={18} color={theme.colors.zippaBlue} />
                            <Text fontSize={14} fontFamily="zippa-medium">Card payment <Text fontSize={12}>+1.5%
                                <Text fontSize={12} color={theme.colors.zippaGreen}> coming soon</Text></Text></Text>
                        </View>
                        <Entypo name="chevron-thin-right" size={18} color={theme.colors.zippaBlue} />
                    </Pressable>
                </View>
                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} text="Okay" action={() => SheetManager.hide("topup-wallet")} />
                </View>
            </ScrollView>
        </SheetWrapper>
    );
}
