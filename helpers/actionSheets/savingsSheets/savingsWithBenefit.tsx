import { Input, InputBox, NairaSign, RightNairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import ZippaButton from "../../../components/Button";
import { Key, useState } from "react";
import { useGlobalStore } from "../../../stores/store";
import Toast from 'react-native-simple-toast';
import { SheetManager } from "react-native-actions-sheet";
import moment from "moment";
import { useSavingsStore } from "../../../stores/feature/savings";
import { useUserStore } from "../../../stores/feature/users";
import { amountInNaira } from "../../../utilities/currencyHelper";
import { ThousandSeparator } from "../../thousandSeparator";

export default function SavingsWithBenefits() {

    const setAppState = useGlobalStore(state => state.setAppState);

    const [benefitSavingsClass, savingsType, addBenefitSavings, updateBalance] = useSavingsStore(state => [state.benefitSavingsClass, state.savingsType, state.addBenefitSavings, state.updateBalance]);
    const userData = useUserStore().userData;
    const [name, setName] = useState<string>();
    const [benefitClass, setBenefitClass] = useState<string>('');
    const [benefitAmount, setBenefitAmount] = useState<string>('');
    const [benefits, setBenefits] = useState<string>('');
    const [benefitsId, setBenefitsId] = useState<string>('');
    const endDate = 11 // 1year or 12 calender month starting from 0;
    const maturityDate = moment().add(endDate, 'months');

    const checkBenefitClass = (value: string) => {
        const result = benefitSavingsClass?.find((param: any) => param.node.amount === "" + value);
        switch (result?.node?.id) {
            case result?.node?.id:
                setBenefits(result?.node?.benefits)
                setBenefitClass(result?.node?.name);
                setBenefitsId(result?.node?.id);
                break;
            default:
                break;
        }
    };

    const handleSaveBenefit = () => {
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
            savings_benefits: parseInt(benefitsId),
            amount: amountInNaira(Number(benefitAmount!)),
            amount_saved: amountInNaira(Number(benefitAmount!)),
            savings_type: parseInt(savingsType?.id),
            term: 12,
            end_date: maturityDate
        };
        (async function __checkTenure() {
            if (!benefitClass || !name) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `All fields are required`,
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            } else if (!userData?.wallet_balance || userData?.wallet_balance < benefitAmount) {
                setAppState("IDLE");
                Toast.showWithGravity(
                    `Insufficient wallet balance`,
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            } else {
                //subtract amount to save from wallet balance
                const newBalance = Number(userData?.wallet_balance) - Number(benefitAmount)

                SheetManager.hide("savings-with-benefits");
                const res = await addBenefitSavings(savingsData);
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

    
    return (
        <SheetWrapper sheetName="savings-with-benefits" gestureEnabled={false}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text fontFamily="zippa-medium" style={{ textAlign: 'center' }}>Create a benefit savings</Text>
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
                    <Text fontSize={10} fontFamily='zippa-regular'>Benefit class</Text>
                    <Picker
                        selectedValue={benefitAmount}
                        onValueChange={(itemValue: string) =>
                            {
                            setBenefitAmount(""+itemValue);
                            checkBenefitClass(itemValue);
                            }
                        }>
                        <Picker.Item fontFamily="zippa-semibold" label="Select benefit class" value=""/>
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
                    <Text fontSize={10} fontFamily='zippa-regular'>Benefit amount</Text>
                    <View>
                        <RightNairaSign />
                        <Input
                            placeholder={!benefitAmount ? "-----" : ThousandSeparator(benefitAmount)}
                            clearTextOnFocus
                            cursorColor={theme.colors.zippaBlack}
                            editable={false}
                        />
                    </View>
                </InputBox>
                <InputBox>
                    <Text fontSize={10} fontFamily='zippa-regular'>Benefits</Text>
                    <Input
                        placeholder={benefits}
                        clearTextOnFocus
                        cursorColor={theme.colors.zippaBlack}
                        editable={false}
                        multiline={true}
                        numberOfLines={5}
                    />
                </InputBox>
                <Text fontSize={14} fontFamily='zippa-bold' color={theme.colors.zippaGreen} style={{ textAlign: 'center' }}>Wallet Bal: {NairaSign()}{ThousandSeparator(Number(userData?.wallet_balance).toFixed(2)) ?? "0.00"}</Text>
                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaViolet} text="Save" action={handleSaveBenefit} disabled={!benefitAmount && true} />
                </View>
            </ScrollView>
        </SheetWrapper>
    );
}
