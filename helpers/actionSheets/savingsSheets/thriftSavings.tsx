import { Input, InputBox, NairaSign, RightNairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import ZippaButton from "../../../components/Button";
import { Key, useState } from "react";
import { useGlobalStore } from "../../../stores/store";
import Toast from 'react-native-simple-toast';
import { SheetManager } from "react-native-actions-sheet";
import { useSavingsStore } from "../../../stores/feature/savings";
import { useUserStore } from "../../../stores/feature/users";
import moment from "moment";
import { amountInNaira } from "../../../utilities/currencyHelper";
import { ThousandSeparator } from "../../thousandSeparator";

export default function ThriftSavings() {
    const setAppState = useGlobalStore(state => state.setAppState);

    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<string>();
    const [frequency, setFrequency] = useState<string>()
    const [selectedValue, setSelectedValue] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    const userData = useUserStore().userData;
    const [savingsFrequency, savingsType, interestRate, addThriftSavings, updateBalance] = useSavingsStore(state => [state.savingsFrequency, state.savingsType, state.interestRate, state.addThriftSavings, state.updateBalance]);

    const handleDeposit = () => {
        setAppState("LOADING");
        const thriftSavingsData = {
            user_id: userData?.id,
            name,
            amount: amountInNaira(Number(amount!)),
            frequency: parseInt(frequency!),
            total_amount: amountInNaira(Number(amount!)),
            amount_saved: amountInNaira(Number(amount!)),
            interest_rate: parseInt(interestRate?.id),
            savings_type: parseInt(savingsType?.id),
            end_date: moment().add(parseInt(endDate!), 'd')
        };
        
        (async function __checkTenure() {
            if (!frequency || !name || !amount || !frequency) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `All fields are required`,
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            } else if (!userData?.wallet_balance || Number(userData?.wallet_balance) < Number(amount)) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `Insufficient wallet balance`,
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            } else {
                //subtract amount to save from wallet balance
                const newBalance = Number(userData?.wallet_balance) - Number(amount)

                SheetManager.hide("thrift-savings");
                const result: any = await addThriftSavings(thriftSavingsData);

                if (!result) {
                    SheetManager.show("failed-transaction", {
                        payload: {
                            value: JSON.stringify({
                                ...thriftSavingsData,
                                savings_type_name: savingsType.name
                            })
                        }
                    });
                    setAppState("IDLE");
                } else {
                    //update wallet balance
                    const balance = await updateBalance(amountInNaira(newBalance), userData?.id);
                    if (balance.updated) {
                        SheetManager.show("successful-transaction", {
                            payload: {
                                value: JSON.stringify({
                                    ...thriftSavingsData,
                                    savings_type_name: savingsType.name
                                })
                            }
                        });
                        setAppState("IDLE");
                    } else {
                        //write logic to remove savings from db and show error
                    }
                }
            }
        })();
    }

    return (
        <SheetWrapper sheetName="thrift-savings">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text fontFamily="zippa-medium" style={{ textAlign: 'center' }}>Create a thrift savings</Text>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Name</Text>
                    <Input
                        onChangeText={setName}
                        value={name}
                        clearTextOnFocus
                        placeholder="Choose a name for this savings"
                    />
                </InputBox>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Amount</Text>
                    <View>
                        <RightNairaSign />
                        <Input
                            onChangeText={setAmount}
                            value={amount}
                            clearTextOnFocus
                            placeholder="Enter amount"
                            keyboardType="numeric"
                        />
                    </View>
                </InputBox>

                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Frequency</Text>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => {
                            setFrequency("" + itemIndex);
                            setSelectedValue(itemValue);
                            setEndDate(itemValue)
                        }
                        }>
                        <Picker.Item fontFamily="zippa-semibold" label="How often?" value="" />
                        {savingsFrequency?.map((item: { node: { id: Key ; name: string; value: any; }; }) => <Picker.Item key={item?.node?.id} fontFamily="zippa-semibold" label={item?.node?.name} value={item.node?.value} />)} 
                    </Picker>
                </InputBox>
                <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaGreen} style={{ textAlign: 'center' }}>Wallet Bal: {NairaSign()}{ThousandSeparator(userData?.wallet_balance) ?? "0.00"}</Text>
                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaOrange} text="Save" action={handleDeposit} disabled={(!amount) && true} />
                </View>
            </ScrollView>
        </SheetWrapper>
    );
};

