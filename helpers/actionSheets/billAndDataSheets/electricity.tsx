import { Input, InputBox, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager } from "react-native-actions-sheet";
import { useBillsStore } from "../../../stores/feature/bills";
import lodash from "lodash";
import DropDownPicker from "react-native-dropdown-picker";
import { useCallback, useEffect, useState } from "react";

export default function Electricity() {

    const [power, discoItem] = useBillsStore(state => [state.power, state.billerItem]);
    // const powerFilterOption = ["AbjBuyPwr", "ABJ", "RMM8030", "EKED", "IBEDCP", "IKEPR"];
    // const powerBundle = power?.filter((item: { ShortName: string; }) => powerFilterOption.includes(item.ShortName));

    // const [loading, setLoading] = useState(false);
    // const groupedPowerBundle = lodash.groupBy(powerBundle, 'Name');

    // const [discos, setDiscos] = useState<any>(powerBundle);
    // const [selectedDiscos, setSelectedDiscos] = useState<any>();
    // const [openDisco, setOpenDisco] = useState(false) 

    // const [amount, setAmount] = useState();
    // const [meterNumber, setMeterNumber] = useState()

    return (
        <SheetWrapper sheetName="electricity" gestureEnabled={false} hideCloseButton={false}>
            <View>
                <Text fontFamily="zippa-medium" fontSize={16} style={{ textTransform: 'uppercase' }}>Buy Electricity</Text>
                <Text fontFamily="zippa-regular" fontSize={14}>Please select your disco and enter the meter number</Text>
                {/* <View style={{ marginTop: 10 }}>
                    <View>
                        <DropDownPicker
                            schema={{
                                label: 'Name',
                                value: 'Name'
                            }}
                            itemKey="Name"
                            placeholder="Electricity Disco"
                            modalAnimationType="none"
                            listMode="FLATLIST"
                            closeIconStyle={{
                                width: 20,
                                height: 20
                            }}
                            open={openDisco}
                            value={selectedDiscos}
                            items={discos}
                            setOpen={setOpenDisco}
                            setValue={setSelectedDiscos}
                            setItems={setDiscos}
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
                            zIndex={10}
                        />
                    </View>
                    <InputBox>
                        <Text fontSize={14}>Meter number</Text>
                        <Input
                            maxLength={10}
                            minLength={10}
                            cursorColor={theme.colors.zippaGrey}
                            inputMode="numeric"
                            value={meterNumber}
                            onChangeText={setMeterNumber}
                            editable={selectedDiscos ? true : false}
                        />
                    </InputBox>
                    <InputBox>
                        <Text fontSize={14}>Amount</Text>
                        <Input
                            cursorColor={theme.colors.zippaGrey}
                            inputMode="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            editable={meterNumber ? true : false}
                        />
                    </InputBox>
                </View>
                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} text="Continue" action={() => SheetManager.show("bill-confirmation", {
                        payload: {
                            value: JSON.stringify({
                                selectedDiscos,
                                amount,
                                meterNumber,
                                name: 'electricity'
                    })}})} />
                </View> */}
            </View>
        </SheetWrapper>
    );
}
