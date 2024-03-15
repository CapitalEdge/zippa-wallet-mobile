import { Input, InputBox, RightNairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ActivityIndicator, Pressable, View, Image } from "react-native";
import { useUserStore } from "../../../stores/feature/users";
import { useCallback, useEffect, useState } from "react";
import { MMKVStorage } from "../../../stores/mmkv-storage";
import DropDownPicker from "react-native-dropdown-picker";
import { ThousandSeparator } from "../../thousandSeparator";
import ZippaButton from "../../../components/Button";
import { SheetManager } from "react-native-actions-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function CableTv() {

    const userData = useUserStore(state => state.userData);
    const cable = JSON.parse(MMKVStorage.getItem("@bills-data") as string);

    const cableTv = [
        {
            id: 1,
            name: "Dstv",
            logo: require("../../../assets/images/networkIcons/dstv.jpeg"),
            data: cable.state.dstv
        },
        {
            id: 2,
            name: "Gotv",
            logo: require("../../../assets/images/networkIcons/gotv.jpeg"),
            data: cable.state.gotv
        }
    ];

    const [provider, setProvider] = useState<string>();
    const [plans, setPlans] = useState<any[]>([]); // Initialize with an empty array
    const [openProvider, setOpenProvider] = useState(false);

    const [value, setValue] = useState<any>();
    
    const [openPlan, setOpenPlan] = useState(false);
    const [loading, setLoading] = useState(false);


    const [items, setItems] = useState<any>(cableTv);
    const [amount, setAmount] = useState<string>('');
    const [decoderNum, setDecoderNum] = useState<string>('');

    const onOpenProvider = useCallback(() => {
        setOpenPlan(false);
    }, []);
    const onOpenPlan = useCallback(() => {
        setOpenProvider(false);
    }, []);


    const getCableItems = () => {
        setLoading(true)
        const result = cableTv.find((x: {name: string}) => x.name === provider)
        setPlans(result?.data);
        setLoading(false)
        setAmount('0');
    }

    useEffect(() => {
        getCableItems();
    }, [provider]);


    useEffect(() => {
        setAmount(value);
    }, [value]);

    const buyCablePlan = async () => {
        const paymentData = {
            customers: [{
                customerId: decoderNum,
                paymentCode: plans[0]?.PaymentCode
            }],
        }
        //await interswitch.customerValidation(paymentData)
        SheetManager.show('bill-confirmation', {
            payload: {
                value: JSON.stringify(Object.assign(paymentData, { value, provider, name: 'cable-tv' }))
            }
        })
    }

    const selectNetwork = (param: string) => {
        setProvider(param);
    }
    

    return (
        <SheetWrapper sheetName="cable-tv" gestureEnabled={false} hideCloseButton={false}>
            <View>
                <Text fontFamily="zippa-medium" fontSize={16} style={{ textTransform: 'uppercase' }}>Pay your cable subscription</Text>
                <Text fontFamily="zippa-regular" fontSize={14}>Please select your cable provider and enter the customer number</Text>
                <View style={{ marginTop: 10 }}>
                    <Text fontFamily="zippa-regular" fontSize={14} style={{ marginBottom: 10 }}>Cable network</Text>
                    <View style={{ flexDirection: 'row', gap: 25 }}>
                        {cableTv.map((data) => <Pressable key={data.id} style={{ width: 75, height: 45, backgroundColor: theme.colors.zippaWhite, paddingVertical: 20, borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: (provider === data?.name) ? 1 : 0, borderColor: theme.colors.zippaGreen }} onPress={() => selectNetwork(data.name)}>
                            <Image source={data?.logo} resizeMode="contain" resizeMethod="auto" style={{ borderRadius: 50, width: 30, height: 30, }} />
                            {provider === data?.name && <Ionicons name="checkmark" size={14} style={{ position: "absolute", right: 0, top: 0, backgroundColor: theme.colors.zippaGreen, color: theme.colors.zippaWhite, borderTopRightRadius: 8 }} />}
                        </Pressable>) }
                    </View>
                    {provider && loading ? <ActivityIndicator size={13} color={theme.colors.zippaGreen} style={{ paddingTop: 10 }} /> : null}
                    {plans?.length > 0 && <View style={{ marginTop: 15 }}>
                        <DropDownPicker
                            schema={{
                                label: 'Name',
                                value: 'Amount'
                            }}
                            itemKey="Id"
                            placeholder="Select bouquet"
                            modalAnimationType="none"
                            listMode="FLATLIST"
                            closeIconStyle={{
                                width: 20,
                                height: 20
                            }}
                            open={openPlan}
                            onOpen={onOpenPlan}
                            value={value}
                            items={plans}
                            setOpen={setOpenPlan}
                            setValue={setValue}
                            setItems={setPlans}
                            closeAfterSelecting={true}
                            style={{
                                borderColor: "transparent",
                                height: 65,
                            }}
                            labelStyle={{
                                fontFamily: "zippa-regular"
                            }}
                            textStyle={{
                                fontFamily: "zippa-regular"
                            }}
                            dropDownContainerStyle={{
                                borderColor: `transparent`
                            }}
                            zIndex={5}
                        />
                    </View>
                    }
                    
                    {value && <InputBox>
                        <Text fontSize={14}>Amount</Text>
                        <View>
                            <RightNairaSign />
                            <Input
                                value={ThousandSeparator(String(Number(amount) / 100))}
                                readOnly={true}
                                style={{ color: theme.colors.zippaBlack }}
                            />
                        </View>
                    </InputBox>
                    }
                    
                    <InputBox>
                        <Text fontSize={14}>UID/Decoder Number</Text>
                        <Input
                            inputMode='numeric'
                            cursorColor={theme.colors.zippaGrey}
                            maxLength={11}
                            minLength={10}
                            value={decoderNum}
                            onChangeText={setDecoderNum}
                            editable={(value && Number(amount) > 0) ? true : false}
                        />
                    </InputBox>
                </View>
                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} text="Continue" action={() => buyCablePlan()} disabled={(decoderNum.length < 10 && Number(amount) > 0)  && true} />
                </View>
            </View>
        </SheetWrapper>
    );
}