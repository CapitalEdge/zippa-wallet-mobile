import React, { useEffect, useCallback, useRef } from "react"
import { Input, InputBox, NairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ActivityIndicator, Image, Pressable, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager } from "react-native-actions-sheet";
import { useState } from "react";
import { useUserStore } from "../../../stores/feature/users";
import DropDownPicker from 'react-native-dropdown-picker';
import { MMKVStorage } from "../../../stores/mmkv-storage";
import { Ionicons } from "@expo/vector-icons";
import NetworkIcons from "../../../components/NetworkIcons";
import { ISW_REF_PREFIX } from "../../../constants/Constants";
import { generateRandomNumber } from "../../randomDigits";
import Spinner from "../../../components/Spinner";
import { useGlobalStore } from "../../../stores/store";



export default function MobileData() {
    const userData = useUserStore(state => state.userData);
    const mobileData = JSON.parse(MMKVStorage.getItem("@bills-data") as string);
    const appState  = useGlobalStore(state => state.appState)

    const mobileDataGroup = [
        {
            id: 1,
            name: "Mtn",
            logo: require("../../../assets//images//networkIcons/mtn.jpeg"),
            data: mobileData.state.mtn_data
        },
        {
            id: 2,
            name: "Glo",
            logo: require("../../../assets//images//networkIcons/glo.jpeg"),
            data: mobileData.state.glo_data
        },
        {
            id: 3,
            name: "Airtel",
            logo: require("../../../assets//images//networkIcons/airtel.jpeg"),
            data: mobileData.state.airtel_data
        },
        {
            id: 4,
            name: "9mobile",
            logo: require("../../../assets//images//networkIcons/9mobile.jpeg"),
            data: mobileData.state.etisalat_data
        },
    ];

    const [value, setValue] = useState<string>();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedBundle, setSelectedBundle] = useState(null);
    const [bundles, setBundles] = useState<any>(null);
    const [number, setNumber] = useState('');
    const [selectedItemData, setSelectedItemData] = useState();



    const getDataBundles = async () => {
        setLoading(true)
        const result = mobileDataGroup.find((x) => x.name === value);
        setBundles(result?.data);
        setLoading(false)
    }


    useEffect(() => {
        getDataBundles();
    }, [value])


    useEffect(() => {
        const itemData = bundles?.find((item: { Amount: string }) => item.Amount === selectedBundle);
        setSelectedItemData(itemData);
    }, [selectedBundle]);

    return (
        <SheetWrapper sheetName="mobile-data" gestureEnabled={false} hideCloseButton={false} ExtraOverlayComponent={appState == 'LOADING' && <Spinner />}>
            <View>
                <Text fontFamily="zippa-medium" fontSize={16} style={{textTransform: 'uppercase'}}>Buy Mobile Data</Text>
                <Text fontFamily="zippa-regular" fontSize={14}>Choose a network for data bundle</Text>
                <View style={{ marginTop: 15 }}>
                    <Text fontFamily="zippa-regular" fontSize={14} style={{ marginBottom: 10 }}>Mobile network</Text>
                    <View style={{flexDirection: 'row', justifyContent: "space-between" }}>
                        {mobileDataGroup.map((data) => <NetworkIcons key={data.id} data={data} value={value} setValue={setValue} />
                        )}
                    </View>
                    {value && loading ? <ActivityIndicator size={13} color={theme.colors.zippaGreen} style={{paddingTop: 10}} /> : null}
                    <View>
                        {bundles?.length > 0 && <View style={{ marginTop: 15 }}>
                            <DropDownPicker
                                schema={{
                                    label: 'Name',
                                    value: 'Amount'
                                }}
                                itemKey="Id"
                                placeholder="Data plan"
                                modalAnimationType="none"
                                listMode="FLATLIST"
                                closeIconStyle={{
                                    width: 20,
                                    height: 20
                                }}
                                open={open}
                                value={selectedBundle}
                                items={bundles}
                                setOpen={setOpen}
                                setValue={setSelectedBundle}
                                setItems={setBundles}
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
                        <Text fontSize={14}>Phone number</Text>
                        <Input
                            inputMode="numeric"
                            maxLength={11}
                            value={number}
                            onChangeText={setNumber}
                            readOnly={!selectedBundle && true}
                            cursorColor={theme.colors.zippaGrey}
                        />
                    </InputBox>
                </View>          

                <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaGreen} style={{ textAlign: 'center' }}>Wallet Bal: {NairaSign()}{userData?.wallet_balance ?? "0.00"}</Text>

                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} text="Continue" action={() => {
                        SheetManager.show('bill-confirmation', {
                            payload: {
                                value: JSON.stringify({value, number, selectedItemData, name: 'mobile-data' })
                            }
                        })
                    }} disabled={number?.length < 11 && true} /> 
                </View>
            </View>
        </SheetWrapper>
    );
}
