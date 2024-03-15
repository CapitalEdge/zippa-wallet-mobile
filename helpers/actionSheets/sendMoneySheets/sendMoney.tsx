import { NairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { ThousandSeparator } from "../../thousandSeparator";
import { router } from "expo-router";
import { InterSwitch } from "../../../utilities/isw";
import { useGlobalStore } from "../../../stores/store";
import Spinner from "../../../components/Spinner";

export default function SendMoney(props: SheetProps<{ value: string }>) {

    const data = JSON.parse(props.payload?.value as string);
    const [appState, setAppState] = useGlobalStore(state => [state.appState, state.setAppState])

    const transferData = {
        "transferCode": "{{transferCode}}",
        "mac": "a4e78f94b652975c9e373fbd5a7c6e61e2f2d25e7a243ae9cc47291003c21566b5ddec89a75d64f908875673f031367c437cd5eb14c9d4d1c278eece80889826",
        "termination": {
            "amount": "10000",
            "accountReceivable": {
                "accountNumber": "3001155245",
                "accountType": "00"
            },
            "entityCode": "044",
            "currencyCode": "566",
            "paymentMethodCode": "AC",
            "countryCode": "NG"
        },
        "sender": {
            "phone": "08124888436",
            "email": "dadubiaro@interswitch.com",
            "lastname": "Adubiaro",
            "othernames": "Deborah"
        },
        "initiatingEntityCode": "PBL",
        "initiation": {
            "amount": "10000",
            "currencyCode": "566",
            "paymentMethodCode": "CA",
            "channel": "7"
        },
        "beneficiary": {
            "lastname": "ralph",
            "othernames": "ralpo"
        }
    }

    const sendMoney = async () => {
        setAppState('LOADING');
        const res = await InterSwitch().sendMoney(transferData);
        console.log(res);
        setAppState('LOADED');

        //SheetManager.hide('send-money');
        // router.push({
        //     pathname: "/screens/enter-confirmation-pin",
        //     params: { route: "send-money" }
        // });
    }

    return (
        <SheetWrapper sheetName="send-money" gestureEnabled={true} hideCloseButton={true} closeOnTouchBackdrop={true} ExtraOverlayComponent={appState == 'LOADING' && <Spinner />}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                <View style={{ marginVertical: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <Text fontFamily="zippa-light" fontSize={14}>You're sending <Text fontFamily="zippa-medium" fontSize={14}>{NairaSign()}{ThousandSeparator(data?.amount)}</Text> to</Text>
                    <Text fontFamily="zippa-medium" fontSize={14} style={{ borderWidth: 1, padding: 5, borderRadius: 10, borderStyle: 'solid', borderColor: theme.colors.zippaGreen, marginVertical: 10,  }}> {data?.accountName}</Text>
                    <Text fontFamily="zippa-regular" fontSize={16}> {data?.bankName} - {data?.accountNumber}</Text>
                    

                </View>

                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} text="Confirm" action={sendMoney} />
                </View>
            </ScrollView>
        </SheetWrapper>
    );
}
