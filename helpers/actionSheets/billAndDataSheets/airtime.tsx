import { Input, InputBox, NairaSign, RightNairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ActivityIndicator, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager } from "react-native-actions-sheet";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "../../../stores/feature/users";
import DropDownPicker from 'react-native-dropdown-picker';
import { MMKVStorage } from "../../../stores/mmkv-storage";
import NetworkIcons from "../../../components/NetworkIcons";
import Spinner from "../../../components/Spinner";
import { useGlobalStore } from "../../../stores/store";


export default function Airtime() {
    const userData = useUserStore(state => state.userData)
    const [appState, setAppState] = useGlobalStore(state => [state.appState, state.setAppState])

    const airtime = JSON.parse(MMKVStorage.getItem("@bills-data") as string);

    const airtimeGroup = [
        {
            id: 1,
            name: "Mtn",
            logo: require("../../../assets/images/networkIcons/mtn.jpeg"),
            data: airtime.state.mtn_airtime
        },
        {
            id: 2,
            name: "Glo",
            logo: require("../../../assets/images/networkIcons/glo.jpeg"),
            data: airtime.state.glo_airtime
        },
        {
            id: 3,
            name: "Airtel",
            logo: require("../../../assets/images/networkIcons/airtel.jpeg"),
            data: airtime.state.airtel_airtime
        },
        {
            id: 4,
            name: "9mobile",
            logo: require("../../../assets/images/networkIcons/9mobile.jpeg"),
            data: airtime.state.etisalat_airtime
        },
    ];

    const [open, setOpen] = useState(false);

    const [amount, setAmount] = useState<string>("");
    const [number, setNumber] = useState();
    const [value, setValue] = useState(null);
    
    const [paymentItems, setPaymentItems] = useState<any>();
    const [selectedItem, setSelectedItem] = useState<any>();
    const [selectedItemData, setSelectedItemData] = useState<any>();


    const [loading, setLoading] = useState(false);

    const getPaymentItems = async () => {
        setLoading(true)
        const item = airtimeGroup.find((x: { name: string; }) => x?.name === value);
        if (item?.id) {
            setPaymentItems(item?.data)
            setLoading(false)
            return;
        }
    };

    useEffect(() => {
        getPaymentItems();
    }, [value]);

    useEffect(() => {
        const amount = Number(selectedItem) / 100;
        setAmount('' + amount);

        const itemData = paymentItems?.filter((item: {Amount: string}) => item.Amount === selectedItem);
        setSelectedItemData(itemData);
    }, [selectedItem]);

    return (
        <SheetWrapper sheetName="airtime" gestureEnabled={false} hideCloseButton={false} ExtraOverlayComponent={appState == 'LOADING' && <Spinner />} >
            <View>
                <Text fontFamily="zippa-medium" fontSize={16} style={{ textTransform: 'uppercase' }}>Airtime Top up</Text>
                <Text fontFamily="zippa-regular" fontSize={14} style={{ marginBottom: 20 }}>Choose a network to topup</Text>
                <View>
                    <Text fontFamily="zippa-regular" fontSize={14} style={{ marginBottom: 10 }}>Mobile network</Text>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                        {airtimeGroup.map((data) => <NetworkIcons key={data.id} data={data} value={value} setValue={setValue} />
                        )}
                    </View>

                    {value && loading ? <ActivityIndicator size={13} color={theme.colors.zippaGreen} style={{ paddingTop: 10 }} /> : null}
                    <View>
                        {paymentItems!?.length > 0 && <View style={{ marginTop: 15 }}>
                            <DropDownPicker
                                schema={{
                                    label: 'Name',
                                    value: 'Amount'
                                }}
                                itemKey="Id"
                                placeholder="Recharge amount"
                                modalAnimationType="none"
                                listMode="FLATLIST"
                                closeIconStyle={{
                                    width: 20,
                                    height: 20
                                }}
                                open={open}
                                value={selectedItem}
                                items={paymentItems}
                                setOpen={setOpen}
                                setValue={setSelectedItem}
                                setItems={setPaymentItems}
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
                                disabled={loading}
                            />
                        </View>}
                    </View>
                    <InputBox>
                        <Text fontSize={14}>Amount</Text>
                        <View>
                            <RightNairaSign />
                            <Input
                                inputMode="numeric"
                                value={!amount ? "" : amount}
                                onChangeText={setAmount}
                                style={{
                                    color: theme.colors.zippaBlack
                                }}
                                
                            />
                        </View>
                    </InputBox>
                    <InputBox>
                        <Text fontSize={14}>Phone number</Text>
                        <Input
                            inputMode="numeric"
                            maxLength={11}
                            value={number}
                            onChangeText={setNumber}
                            editable={value ? true : false}
                        />
                    </InputBox>
                    
                </View>
                <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaGreen} style={{ textAlign: 'center' }}>Wallet Bal: {NairaSign()}{userData?.wallet_balance ?? "0.00"}</Text>

                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} disabled={!paymentItems && true} text="Continue" action={() => SheetManager.show("bill-confirmation", {
                        payload: {
                            value: JSON.stringify({ selectedItemData: selectedItemData[0], value, number, name: 'airtime' })
                        }
                    })} />
                </View>
            </View>
        </SheetWrapper>
    )
}