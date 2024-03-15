import { Input, InputBox, NairaSign, RightNairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View, KeyboardAvoidingView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import ZippaButton from "../../../components/Button";
import { Key, useState } from "react";
import { useGlobalStore } from "../../../stores/store";
import Toast from 'react-native-simple-toast';
import { SheetManager } from "react-native-actions-sheet";
import moment from "moment";
import { useSavingsStore } from "../../../stores/feature/savings";
import { useUserStore } from "../../../stores/feature/users";
import RadioButton from "../../../components/RadioButton";
import { Months } from "../../../constants/DropdownClasses";
import { amountInNaira } from "../../../utilities/currencyHelper";
import { ThousandSeparator } from "../../thousandSeparator";

export default function TargeSavings():JSX.Element {

    const setAppState = useGlobalStore(state => state.setAppState);
    const [savingsFrequency, savingsType, savingsMode, addTargetSavings, interestRate, updateBalance] = useSavingsStore(state => [state.savingsFrequency, state.savingsType, state.savingsMode, state.addTargetSavings, state.interestRate, state.updateBalance]);

    const [selectedOption, setSelectedOption] = useState<any>(null);

    const [term, setTerm] = useState<string>();
    const userData = useUserStore().userData;
    const [name, setName] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [savingsAmount, setSavingsAmount] = useState<string>('');

    const [frequency, setFrequency] = useState<string>()
    const [selectedValue, setSelectedValue] = useState<string>();

    const onSelect = (item: { node: { key: string } }) => {
        if (selectedOption?.node?.key === item?.node?.key) {
            setSelectedOption(null);
        } else {
            setSelectedOption(item);
        }
    };


    const maturityDate = moment().add(parseInt(term!), 'months');

    const handleSmartKiddiesSavings = () => {
        setAppState("LOADING");
        const savingsData: {
            user_id: string;
            name: string | undefined;
            amount: string;
            savings_type: number;
            term: number;
            savings_mode: number;
            interest_rate: number;
            frequency: number | null;
            total_amount: string;
            amount_saved: string;
            end_date: moment.Moment;
        } = {
            user_id: userData?.id,
            name,
            amount: amountInNaira(Number(amount)),
            savings_type: +Number(savingsType?.id),
            savings_mode: selectedOption?.node?.id,
            interest_rate: Number(interestRate?.id),
            frequency: Number(frequency!) || null, 
            total_amount: amountInNaira(Number(savingsAmount)),
            amount_saved: amountInNaira(Number(savingsAmount)),
            term: Number(term!),
            end_date: maturityDate
        };
        (async function __checkTenure() {
            if (!term || !name || !amount || !savingsAmount || !selectedOption?.node?.id ) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `All fields are required`,
                    Toast.SHORT,
                    Toast.BOTTOM,
                )
            } else if (selectedOption?.node?.key === 'flex' && !frequency) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `Frequency is required`,
                    Toast.SHORT,
                    Toast.BOTTOM,
                )
            } else if (!userData?.wallet_balance || Number(userData?.wallet_balance) < Number(amount)) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `Insufficient wallet balance`,
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            } else {
                //subtract amount to save from wallet balance
                const newBalance = Number(userData?.wallet_balance) - Number(savingsAmount)
                
                SheetManager.hide("target-savings");
                const res = await addTargetSavings(savingsData);
                //@ts-ignore
                if (res?.length > 0) {
                    //update wallet balance
                    const balance = await updateBalance(amountInNaira(newBalance), userData?.id);
                    if (balance?.updated) {
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
                    SheetManager.show("failed-transaction", {
                        payload: {
                            value: JSON.stringify({
                                ...savingsData,
                                savings_type_name: savingsType.name
                            })
                        }
                    });
                    setAppState("IDLE");
                }
            }
        })();
    }


    function AutoSavingFrequency() {
        return (
            <View>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Frequency</Text>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => {
                            setFrequency("" + itemIndex);
                            setSelectedValue(itemValue);
                        }
                        }>
                        <Picker.Item fontFamily="zippa-semibold" label="How often?" value="" />
                        {savingsFrequency?.map((item: { node: { id: Key; name: string; value: any; }; }) => <Picker.Item key={item?.node?.id} fontFamily="zippa-semibold" label={item?.node?.name} value={item.node?.value} />)}
                    </Picker>
                </InputBox>
            </View>
        )
    };

    return (
        <KeyboardAvoidingView>
            <SheetWrapper sheetName="target-savings" gestureEnabled={false}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text fontFamily="zippa-medium" style={{ textAlign: 'center' }}>Create a target savings</Text>
                    <InputBox>
                        <Text fontSize={10} fontFamily='zippa-regular'>Name</Text>
                        <Input
                            placeholder="Enter a name for this target"
                            clearTextOnFocus
                            cursorColor={theme.colors.zippaBlack}
                            onChangeText={setName}
                        />
                    </InputBox>
                    <InputBox>
                        <Text fontSize={10} fontFamily='zippa-regular'>Target amount</Text>
                        <View style={{flexDirection: 'row'}}>
                            <RightNairaSign />
                            <Input
                                placeholder="Enter target amount"
                                value={amount}
                                onChangeText={setAmount}
                                inputMode='numeric'
                                clearTextOnFocus
                                cursorColor={theme.colors.zippaBlack}
                            />
                        </View>
                    </InputBox>
                    <InputBox>
                        <Text fontSize={10} fontFamily='zippa-regular'>Term</Text>
                        <Picker
                            selectedValue={term}
                            onValueChange={(itemValue: string) => { setTerm(itemValue) }
                            }>
                            <Picker.Item fontFamily="zippa-semibold" label="How long?" value="" />
                            {Months.slice(0, 6).map(item => <Picker.Item key={item.id} label={item.label} value={item.month} />)}
                        </Picker>
                    </InputBox>
                    <InputBox>
                        <Text fontSize={10} fontFamily='zippa-regular'>Savings amount</Text>
                        <View style={{flexDirection: 'row'}}>
                            <RightNairaSign />
                            <Input
                                placeholder="Amount to save now"
                                value={savingsAmount.toLocaleString()}
                                onChangeText={setSavingsAmount}
                                inputMode='numeric'
                                cursorColor={theme.colors.zippaBlack}
                            />
                        </View>
                    </InputBox>
                    <InputBox>
                        <Text fontSize={10} fontFamily='zippa-regular'>Pick a mode of saving</Text>
                        <RadioButton
                            selectedOption={selectedOption}
                            onSelect={onSelect}
                            options={savingsMode}
                        />
                    </InputBox>
                    {selectedOption?.node?.key === "flex" && <AutoSavingFrequency />}
                    <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaGreen} style={{ textAlign: 'center', marginVertical: 10 }}>Wallet Bal: {NairaSign()}{ThousandSeparator(Number(userData?.wallet_balance).toFixed(2)) ?? "0.00" }</Text>
                    <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                        <ZippaButton color={theme.colors.zippaLightBlue} text="Save target" action={handleSmartKiddiesSavings} disabled={(!amount || !savingsAmount) && true} />
                    </View>
                </ScrollView>
            </SheetWrapper>
        </KeyboardAvoidingView>
    );
};