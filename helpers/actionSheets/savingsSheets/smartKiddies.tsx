import { Input, InputBox, NairaSign, RightNairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import ZippaButton from "../../../components/Button";
import {Key, useState } from "react";
import { useGlobalStore } from "../../../stores/store";
import Toast from 'react-native-simple-toast';
import { SheetManager } from "react-native-actions-sheet";
import moment from "moment";
import { useSavingsStore } from "../../../stores/feature/savings";
import { useUserStore } from "../../../stores/feature/users";
import { amountInNaira } from "../../../utilities/currencyHelper";
import { ThousandSeparator } from "../../thousandSeparator";

export default function SmartKiddies() {

    const setAppState = useGlobalStore(state => state.setAppState);

    const [benefitSavingsClass, savingsType, addSmartKiddiesSavings, updateBalance] = useSavingsStore(state => [state.benefitSavingsClass, state.savingsType, state.addSmartKiddiesSavings, state.updateBalance]);
    const userData = useUserStore().userData;
    const [name, setName] = useState<string>();
    const [incentivesClass, setIncentivesClass] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [incentives, setIncentives] = useState<string>('');
    const [incentivesId, setIncentivesId] = useState<string>('');
    const endDate = 11 // 1year or 12 calender month starting from 0;
    const maturityDate = moment().add(endDate, 'months'); 

    const checkSmartKiddiesClass = (value: string) => {
        const result = benefitSavingsClass?.find((param: any) => param.node.amount === "" + value);
        switch (result?.node?.id) {
            case result?.node?.id:
                setIncentives(result?.node?.benefits)
                setIncentivesClass(result?.node?.name);
                setIncentivesId(result?.node?.id);
                break;
            default:
                break;
        }
    };

    const handleSmartKiddiesSavings = () => {
        setAppState("LOADING");
        const savingsData: {
            user_id: string;
            name: string | undefined;
            savings_benefits: number;
            amount: string;
            amount_saved: string;
            savings_type: number;
            term: number;
            end_date: moment.Moment;
        } = {
            user_id: userData?.id,
            name,
            savings_benefits: parseInt(incentivesId),
            amount: amountInNaira(Number(amount!)),
            amount_saved: amountInNaira(Number(amount!)),
            savings_type: parseInt(savingsType?.id),
            term: 12,
            end_date: maturityDate
        };
        (async function __checkTenure() {
            if (!incentivesClass || !name) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `Name and incentives class is required`,
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            } else if (!userData?.wallet_balance || userData?.wallet_balance < amount) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `Insufficient wallet balance`,
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            } else {
                //subtract amount to save from wallet balance
                const newBalance = Number(userData?.wallet_balance) - Number(amount)

                SheetManager.hide("smart-kiddies-savings");
                const res = await addSmartKiddiesSavings(savingsData);
                if (res) {
                    //update wallet balance
                    const balance = await updateBalance(amountInNaira(newBalance), userData?.id);

                    if (balance.updated) {
                        SheetManager.show("successful-transaction", {
                            payload: {
                                value: JSON.stringify({
                                    ...savingsData,
                                    savings_type_name: savingsType.name
                                })
                            }
                        });
                        setAppState("IDLE");
                    } else {
                        //write logic to remove savings from db and show error
                    }
                } else {
                    setAppState("IDLE");
                    Toast.showWithGravity(
                        `An error occurred`,
                        Toast.SHORT,
                        Toast.BOTTOM,
                    );
                }
            }
        })();
    }


    return (
        <SheetWrapper sheetName="smart-kiddies-savings" gestureEnabled={false}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text fontFamily="zippa-medium" style={{ textAlign: 'center' }}>Create a smart kiddies savings</Text>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Name</Text>
                    <Input
                        placeholder="Enter a name for this benefit savings"
                        clearTextOnFocus
                        cursorColor={theme.colors.zippaBlack}
                        onChangeText={setName}
                    />
                </InputBox>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Smart kiddies class</Text>
                    <Picker
                        selectedValue={amount}
                        onValueChange={(itemValue: string) => {
                            setAmount("" + itemValue);
                            checkSmartKiddiesClass(itemValue);
                        }
                        }>
                        <Picker.Item fontFamily="zippa-semibold" label="Select smart kiddies class" value="" />
                        {benefitSavingsClass && benefitSavingsClass?.map((item: { node: { id: Key; name: string; amount: number; }; }) => <Picker.Item key={item?.node?.id} label={item?.node?.name} value={item?.node?.amount} />)}
                    </Picker>
                </InputBox>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Term</Text>
                    <Input
                        placeholder={`1 year`}
                        clearTextOnFocus
                        cursorColor={theme.colors.zippaBlack}
                        editable={false}
                    />
                </InputBox>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Savings amount</Text>
                    <View>
                        <RightNairaSign />
                        <Input
                            placeholder={!amount ? "-----" : ThousandSeparator(amount)}
                            clearTextOnFocus
                            cursorColor={theme.colors.zippaBlack}
                            editable={false}
                        />
                    </View>
                </InputBox>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Saving incentives</Text>
                    <Input
                        placeholder={incentives}
                        clearTextOnFocus
                        cursorColor={theme.colors.zippaBlack}
                        editable={false}
                        multiline={true}
                        numberOfLines={5}
                    />
                </InputBox>
                <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaGreen} style={{ textAlign: 'center' }}>Wallet Bal: {NairaSign()}{ThousandSeparator(Number(userData?.wallet_balance).toFixed(2)) ?? "0.00"}</Text>
                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaViolet} text="Save" action={handleSmartKiddiesSavings} disabled={!amount && true} />
                </View>
            </ScrollView>
        </SheetWrapper> 
    );
}

