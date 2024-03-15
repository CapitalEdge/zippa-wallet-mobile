import { Input, InputBox, NairaSign, RightNairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import ZippaButton from "../../../components/Button";
import { useEffect, useState } from "react";
import { useGlobalStore } from "../../../stores/store";
import Toast from 'react-native-simple-toast';
import { SheetManager } from "react-native-actions-sheet";
import moment from "moment";
import { useSavingsStore } from "../../../stores/feature/savings";
import { Months } from "../../../constants/DropdownClasses";
import { useUserStore } from "../../../stores/feature/users";
import { amountInNaira } from "../../../utilities/currencyHelper";
import { ThousandSeparator } from "../../thousandSeparator";

export default function FixedDeposit() {
    const setAppState = useGlobalStore(state => state.setAppState);
    //form values
    const [name, setName] = useState<string>();
    const [amount, setAmount] = useState<string>(); 
    const [tenure, setTenure] = useState<number>();
    const [interest, setInterest] = useState<any>();
    const [totalAmount, setTotalAmount] = useState<string>();
    
    //state values
    const [
        savingsType,
        addFixedDeposit,
        interestRate,
        updateBalance
    ] = useSavingsStore(
        state => [
            state.savingsType,
            state.addFixedDeposit,
            state.interestRate,
            state.updateBalance]
        ); 
    const userData = useUserStore().userData;

    useEffect(() => {
        //get the amount after tenure by coercing data types appropriately
        let mounted = true;
        if (mounted) {
            const interest = parseFloat(amount!) * parseFloat(("" + (interestRate?.rate / 100).toFixed(3)));
            const compoundInterest = interest * tenure!;
            const amountAfterTenure = parseFloat(amount!) + compoundInterest;
            if (amountAfterTenure) {
                setTotalAmount(""+amountAfterTenure.toFixed(2));
            } 
        }
        return () => {
            mounted = false;
        }
    }, [amount, tenure]);
    

    //calc endate from the selected tenure, minus 1 as counting start from 0. So January would be 0 value
    const endDate = tenure! - 1
    //using the momentjs method to add the end date(month) value and specify if it's day|week|month|year
    const maturityDate = moment().add(endDate, 'months');

    const handleDeposit = () => {
        setAppState("LOADING");
        //fixed deposit mutation input
        const depositData: {
            user_id: any;
            name: string;
            amount: string;
            term: number;
            interest_rate: number;
            savings_type: number;
            total_amount: string;
            amount_saved: string;
            end_date: moment.Moment;
        } = {
            user_id: userData?.id,
            name: name!,
            amount: amountInNaira(Number(amount!)),
            term: tenure!,
            interest_rate: parseInt(interestRate?.id),
            savings_type: parseInt(savingsType?.id),
            total_amount: amountInNaira(Number(totalAmount!)),
            amount_saved: amountInNaira(Number(amount!)),
            end_date: maturityDate
        };

        (async function __checkTenure() {
            if (!tenure || !amount || !name) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `All fields are required`,
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

                SheetManager.hide("fixed-deposit-sheet");
                const res = await addFixedDeposit(depositData);
                //@ts-ignore
                if (res?.length > 0) {
                    //update wallet balance
                    const balance = await updateBalance(amountInNaira(newBalance), userData?.id);

                    if (balance.updated) {
                        SheetManager.show("successful-transaction", {
                            payload: {
                                value: JSON.stringify({
                                    ...depositData,
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
                                ...depositData,
                                savings_type_name: savingsType.name
                            })
                        }
                    });
                    setAppState("IDLE");
                }
            }
        })();
    }

    return (
        <SheetWrapper  sheetName="fixed-deposit-sheet">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text fontFamily="zippa-medium" style={{textAlign: 'center'}}>Create a fixed deposit savings</Text>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Name</Text>
                    <Input
                        onChangeText={setName}
                        value={name}
                        clearTextOnFocus
                        placeholder="Choose a name for this fixed deposit"
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
                    <Text fontSize={10} fontFamily='zippa-regular'>Term</Text>
                    <Picker
                        selectedValue={tenure}
                        onValueChange={(itemValue) =>
                            setTenure(itemValue)
                        }>
                        <Picker.Item  label="How long?" value="" />
                        {Months.map(item => <Picker.Item key={item.id} label={item.label} value={item.month} />)}
                    </Picker>
                </InputBox>
                <InputBox> 
                    <Text fontSize={10} fontFamily='zippa-regular'>Amount after tenure</Text>
                    <View>
                        <RightNairaSign />
                        <Input
                            onChangeText={setTotalAmount}
                            placeholder={totalAmount}
                            clearTextOnFocus
                            cursorColor={theme.colors.zippaBlack}
                            editable={false}
                        />
                    </View>
                </InputBox>
                <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaGreen} style={{ textAlign: 'center' }}>Wallet Bal: {NairaSign()}{ThousandSeparator(Number(userData?.wallet_balance).toFixed(2)) ?? "0.00"}</Text>
                <View style={{paddingTop: 5, paddingBottom: 15}}>
                    <ZippaButton color={theme.colors.zippaViolet} text="Deposit" action={handleDeposit} disabled={(!amount || !totalAmount) && true} />
                </View>
            </ScrollView>
        </SheetWrapper>
    );
};

