import { NairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { InterSwitch } from "../../../utilities/isw";
import { useGlobalStore } from "../../../stores/store";
import Spinner from "../../../components/Spinner";
import { useUserStore } from "../../../stores/feature/users";
import { ISW_REF_PREFIX, ISW_TERMINAL_ID } from "../../../constants/Constants";
import { generateRandomNumber } from "../../randomDigits";
import { router } from "expo-router";
import { Slugify } from "../../slugify";
import Toast from "react-native-simple-toast"
import { ThousandSeparator } from "../../thousandSeparator";
import { useBillsStore } from "../../../stores/feature/bills";


const interSwitch = InterSwitch();

export default function BillConfirmation(props: SheetProps<{ value: string }>) {
    const userData = useUserStore(state => state.userData)
    const addAirtimeAndData = useBillsStore(state => state.addAirtimeAndData);
    const randomDigitNumber = generateRandomNumber(10);
    const data = JSON.parse(props.payload?.value as string);
    const [appState, setAppState] = useGlobalStore(state => [state.appState, state.setAppState]);

    

    //mobile data confirmation sheet
    function MobileData() {
        const mobile_data = data;

        const confirmMobileDataPurchase = async () => {
            setAppState("LOADING");
            
            const payload = {
                paymentCode: mobile_data.selectedItemData.PaymentCode,
                customerId: `234` + mobile_data.number.substring(1),
                customerMobile: `234` + mobile_data.number.substring(1),
                customerEmail: userData.email,
                amount: mobile_data.selectedItemData.Amount,
                requestReference: ISW_REF_PREFIX + '' + randomDigitNumber,
                "TerminalId": ISW_TERMINAL_ID!
            } as const;

            try {
                const adviceResponse = await interSwitch.postBillPaymentAdvice(payload);
                //confirm transaction before success
                if (adviceResponse?.ResponseCodeGrouping === "SUCCESSFUL") {
                    const input = {
                        "customer_number": payload.customerMobile,
                        "customer_email": payload.customerEmail,
                        "transaction_type": 4, //get transxn type
                        "amount": payload.amount,
                        "reference": adviceResponse?.TransactionRef,
                        "type": "airtime",
                        "details": JSON.stringify({ ref: adviceResponse?.TransactionRef, data: mobile_data?.selectedItemData })
                    } as const;

                    const dbResult = await addAirtimeAndData(input);
                    //show receipt after success
                    if (dbResult[0]['id']) {
                        setAppState("LOADED");
                        SheetManager.hide('mobile-data');
                        SheetManager.hide('bill-confirmation');
                        router.push({ pathname: `/screens/(receipts)/${Slugify(adviceResponse?.TransactionRef)}`, params: { details: JSON.stringify({ ...adviceResponse, BillerName: mobile_data?.selectedItemData?.BillerName, ItemName: mobile_data?.selectedItemData?.Name, name: 'Data bundle' }) } })
                    }
                    
                } else {
                    Toast.showWithGravity(
                        'Service unavailable. Try again later.',
                        Toast.LONG,
                        Toast.BOTTOM,
                    );
                    setAppState("LOADED");
                }
                
                return;
            } catch (error) {
                console.log(error)
                Toast.showWithGravity(
                    'An error occured. Check back soon.',
                    Toast.LONG,
                    Toast.BOTTOM,
                );
                setAppState("LOADED");
            }
        }

        return (
            <SheetWrapper sheetName="bill-confirmation" gestureEnabled={true} hideCloseButton={true} closeOnTouchBackdrop={true} ExtraOverlayComponent={appState == 'LOADING' && <Spinner />}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ marginVertical: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text fontFamily="zippa-light" fontSize={14}>Confirm purchase of </Text>
                        <Text fontFamily="zippa-medium" fontSize={14}>{NairaSign()}{ThousandSeparator(String(Math.ceil(mobile_data?.selectedItemData?.Amount / 100)))} {mobile_data?.selectedItemData?.BillerName}</Text> 
                        <Text fontFamily="zippa-medium" fontSize={14} style={{ borderWidth: 1, padding: 5, borderRadius: 10, borderStyle: 'solid', borderColor: theme.colors.zippaGreen, marginVertical: 10, }}> {mobile_data?.selectedItemData?.Name}</Text>
                        <Text fontFamily="zippa-regular" fontSize={16}>{mobile_data?.number}</Text>
                    </View>

                    <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                        <ZippaButton color={theme.colors.zippaBlue} text="Confirm" action={() => {
                            confirmMobileDataPurchase()
                        }} />
                    </View>
                </ScrollView>
            </SheetWrapper>
        );
    };


    //airtime top-up confirmation sheet
    function Airtime() {
        const airtime = data;

        const confirmAirtimePurchase = async () => {
            setAppState("LOADING");

            //payment advice payload
            const payload = {
                paymentCode: airtime.selectedItemData.PaymentCode,
                customerId: `234` + airtime.number.substring(1),
                customerMobile: `234` + airtime.number.substring(1),
                customerEmail: userData.email,
                amount: airtime.selectedItemData.Amount,
                requestReference: ISW_REF_PREFIX + '' + randomDigitNumber,
                "TerminalId": ISW_TERMINAL_ID!
            } as const;


            try {
                const adviceResponse = await interSwitch.postBillPaymentAdvice(payload);

                if (adviceResponse?.ResponseCodeGrouping === "SUCCESSFUL") {
                    //db mutation input data
                    const input = {
                        "customer_number": payload.customerMobile,
                        "customer_email": payload.customerEmail,
                        "transaction_type": 4, //get transxn type
                        "amount": payload.amount,
                        "reference": adviceResponse?.TransactionRef,
                        "type": "airtime",
                        "details": JSON.stringify({ ref: adviceResponse?.TransactionRef, data: airtime?.selectedItemData })
                    } as const;

                    const dbResult = await addAirtimeAndData(input);
                    if (dbResult[0]['id']) {
                        setAppState("LOADED");
                        SheetManager.hide('airtime');
                        SheetManager.hide('bill-confirmation');
                        router.push({ pathname: `/screens/(receipts)/${Slugify(adviceResponse?.TransactionRef)}`, params: { details: JSON.stringify({ ...adviceResponse, BillerName: airtime?.selectedItemData?.BillerName, ItemName: airtime?.selectedItemData?.Name, name: 'Airtime' }) } })
                    }

                } else {
                    Toast.showWithGravity(
                        'Service unavailable. Try again later.',
                        Toast.LONG,
                        Toast.BOTTOM,
                    );
                    setAppState("LOADED");
                }
                setAppState("LOADED");
                return;
            } catch (error) {
                console.log(error)
            }
        }
        
        return (
            <SheetWrapper sheetName="bill-confirmation" gestureEnabled={true} hideCloseButton={true} closeOnTouchBackdrop={true} ExtraOverlayComponent={appState == 'LOADING' && <Spinner />}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ marginVertical: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text fontFamily="zippa-light" fontSize={14}>Confirm purchase <Text fontFamily="zippa-medium" fontSize={14}> </Text></Text>
                        <Text fontFamily="zippa-medium" fontSize={14} style={{ borderWidth: 1, padding: 5, borderRadius: 10, borderStyle: 'solid', borderColor: theme.colors.zippaGreen, marginVertical: 10, }}> {NairaSign() + airtime?.selectedItemData?.Amount / 100 + ' ' + airtime?.value + ' ' + airtime?.name}</Text>
                        <Text fontFamily="zippa-medium" fontSize={14}>{NairaSign()}{ThousandSeparator(String(Math.ceil(airtime?.selectedItemData?.Amount / 100)))} {airtime?.selectedItemData?.BillerName}</Text> 
                        <Text fontFamily="zippa-medium pt-2" fontSize={18}>{airtime?.number}</Text> 
                    </View>

                    <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                        <ZippaButton color={theme.colors.zippaBlue} text="Confirm" action={() => {
                            confirmAirtimePurchase()
                        }} />
                    </View>
                </ScrollView>
            </SheetWrapper>
        );
    }


    //cable tv subscription confirmation sheet
    function CableTv() {
        const cables = data;

        const confirmCableSubscription = async () => {
            setAppState('LOADING');
            const payload = {
                paymentCode: data['paymentCode'],
                customerId: data?.customerId,
                customerNumber: data?.customerNumber,
                customerEmail: data?.customerEmail,
                amount: data?.amount,
                requestReference: data?.requestReference
            } as const;
            //const res = await interSwitch.postBillPaymentAdvice(payload);
            setAppState('IDLE')
            // SheetManager.hide('bill-confirmation');
            // router.push({
            //     pathname: "/screens/enter-confirmation-pin",
            //     params: { route: "send-money" }
            // });
        }

        return (
            <SheetWrapper sheetName="bill-confirmation" gestureEnabled={true} hideCloseButton={true} closeOnTouchBackdrop={true} ExtraOverlayComponent={appState == 'LOADING' && <Spinner />}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* <View style={{ marginVertical: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text fontFamily="zippa-light" fontSize={14}>You're buying <Text fontFamily="zippa-medium" fontSize={14}>{data?.bundles[0]?.BillerName}</Text></Text>
                        <Text fontFamily="zippa-medium" fontSize={14} style={{ borderWidth: 1, padding: 5, borderRadius: 10, borderStyle: 'solid', borderColor: theme.colors.zippaGreen, marginVertical: 10, }}> {data?.bundles[0]?.Name}</Text>
                        <Text fontFamily="zippa-regular" fontSize={16}> {data?.number} - {NairaSign()}{data?.amount / 100}</Text>
                    </View> */}

                    <View>
                        <Text>Customer validation sheet</Text>
                    </View>

                    <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                        <ZippaButton color={theme.colors.zippaBlue} text="Confirm" action={() => {
                            confirmCableSubscription()
                        }} />
                    </View>
                </ScrollView>
            </SheetWrapper>
        );
    }


    //electricity subscription confirmation sheet
    function Electricity() {
        const electricity = data;

        const confirmElectricitySubscription = async () => {
            setAppState('LOADING');
            const payload = {
                paymentCode: data['paymentCode'],
                customerId: data?.customerId,
                customerNumber: data?.customerNumber,
                customerEmail: data?.customerEmail,
                amount: data?.amount,
                requestReference: data?.requestReference
            } as const;
            //const res = await interSwitch.postBillPaymentAdvice(payload);
            setAppState('IDLE')
            // SheetManager.hide('bill-confirmation');
            // router.push({
            //     pathname: "/screens/enter-confirmation-pin",
            //     params: { route: "send-money" }
            // });
        }

        return (
            <SheetWrapper sheetName="bill-confirmation" gestureEnabled={true} hideCloseButton={true} closeOnTouchBackdrop={true} ExtraOverlayComponent={appState == 'LOADING' && <Spinner />}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* <View style={{ marginVertical: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text fontFamily="zippa-light" fontSize={14}>You're buying <Text fontFamily="zippa-medium" fontSize={14}>{data?.bundles[0]?.BillerName}</Text></Text>
                        <Text fontFamily="zippa-medium" fontSize={14} style={{ borderWidth: 1, padding: 5, borderRadius: 10, borderStyle: 'solid', borderColor: theme.colors.zippaGreen, marginVertical: 10, }}> {data?.bundles[0]?.Name}</Text>
                        <Text fontFamily="zippa-regular" fontSize={16}> {data?.number} - {NairaSign()}{data?.amount / 100}</Text>
                    </View> */}

                    <View>
                        <Text>Customer validation sheet</Text>
                    </View>

                    <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                        <ZippaButton color={theme.colors.zippaBlue} text="Confirm" action={() => {
                            confirmElectricitySubscription()
                        }} />
                    </View>
                </ScrollView>
            </SheetWrapper>
        );
    }


    return (
        data["name"] == "cable-tv" ? <CableTv /> :
            data["name"] == "mobile-data" ? <MobileData /> :
                data["name"] == "airtime" ? <Airtime /> : 
                    data["name"] == "electricity" ? <Electricity /> : null
    );
}


