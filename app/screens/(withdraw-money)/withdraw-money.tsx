import { KeyboardAvoidingView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { Input, InputBox, RightNairaSign, ScreenContent, Text, theme } from '../../../components/Themed'

import DropDownPicker from 'react-native-dropdown-picker';

import ZippaButton from '../../../components/Button';
import { useGlobalStore } from '../../../stores/store';
import { SheetManager } from 'react-native-actions-sheet';
import { useTransferStore } from '../../../stores/feature/transfer';
import { InterSwitch } from '../../../utilities/isw';
import { useBillsStore } from '../../../stores/feature/bills';

const interswitch =  InterSwitch();

/**
 * Component for sending money
 */
export default function WithdrawMoney() {
    const [banks, allBanks] = useBillsStore(state => [state.banks, state.allBanks]) 
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [accountName, setAccountName] = useState<string>('');
    const [bankName, setBankName] = useState<string | null>('');
    const setAppState = useGlobalStore(state => state.setAppState);
    const [amount, setAmount] = useState<string>();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [items, setItems] = useState<any[]>(banks);

    const [pinConfirmed, setPinConfirmed] = useTransferStore(state => [state.pinConfirmed, state.setPinConfirmed])

    useEffect(() => {
        (async () => {
            await allBanks();
        })();
        console.log({ banks })
    }, []);
    /**
     * Fetches the account name
     */
    async function fetchAccountName() {
        setAppState("LOADING");
        const data = await interswitch.fetchAccountDetail({ account: accountNumber, bankCode: value! });
        if (data?.AccountName) {
            setAccountName(data?.AccountName)
            setAppState("LOADED");
        } else {
            setAppState("LOADED");
        }
    }

    

    // Fetch account name when account number and bank are selected
    useEffect(() => {
        if (accountNumber.length === 10 && value) {
           fetchAccountName();
        } else {
            setAccountName('');
        }
        const bank = banks?.find((item: any) => item.CbnCode === value) as unknown as { Name: string };
        setBankName(bank?.Name)

    }, [value, accountNumber]); 


    useEffect(() => {
        if (pinConfirmed) {
            setAppState("LOADING");
            setTimeout(() => {
                setPinConfirmed(!pinConfirmed)
                setAppState("IDLE");
                setAccountNumber('');
                setValue(null);
                setAmount('');
                SheetManager.show('successful-transaction', {
                    payload: {
                        value: JSON.stringify({
                            amount,
                            accountName,
                            accountNumber,
                            bankName
                    })
                }});
            }, 8000)
        }
        
    }, [pinConfirmed]); 

    return (
        <>
            <Stack.Screen options={{
                title: 'Withdraw Money',
                headerShown: true,
                animation: 'none',
            }} />
            <View>
                {/* <KeyboardAvoidingView>
                    <ScreenContent>
                        <View style={{ marginTop: 20, marginBottom: 10 }}>
                            <Text>Withdraw money to your bank account</Text>
                        </View>
                        
                        <View style={{ backgroundColor: theme.colors.zippaWhite, borderRadius: 10, zIndex: 2}}>
                            <Text style={{paddingLeft: 10, paddingTop: 10}}>Bank</Text>
                            <DropDownPicker
                                schema={{
                                    label: 'Name',
                                    value: 'CbnCode'
                                }}
                                searchable={true}
                                searchPlaceholder="Search bank name..."
                                placeholder="Select destination bank"
                                listMode="FLATLIST"
                                autoScroll={true}
                                flatListProps={{
                                    initialNumToRender: 10
                                }}
                                modalAnimationType="none"
                                closeAfterSelecting={true}
                                closeIconStyle={{
                                    width: 20,
                                    height: 20
                                }}
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                style={{
                                    borderColor: "transparent",
                                }}
                                labelStyle={{
                                    fontFamily: "zippa-regular"
                                }}
                                textStyle={{
                                    fontFamily: "zippa-regular"
                                }}
                                dropDownContainerStyle={{
                                    borderColor: `transparent`,
                                }}
                                maxHeight={550}
                                containerStyle={{
                                    borderColor: `transparent`,
                                }}
                                listItemContainerStyle={{

                                }}
                                searchContainerStyle={{
                                    borderBottomColor: "transparent"
                                }}
                                searchTextInputProps={{
                                    maxLength: 25,
                                    cursorColor: theme.colors.zippaGrey
                                }}
                                zIndex={5}
                            />
                        </View>
                        <InputBox>
                            <Text>Recipient Account</Text>
                            <Input
                                value={accountNumber}
                                onChangeText={setAccountNumber}
                                placeholder="Enter 10 digit account number"
                                clearTextOnFocus
                                cursorColor={theme.colors.zippaGrey}
                                inputMode='numeric'
                                clearButtonMode='while-editing'
                                maxLength={10}
                            />
                        </InputBox>
                        {!!accountName && <View style={{ padding: 10 }}>
                            <Text fontSize={15} fontFamily="zippa-medium" style={{ color: theme.colors.zippaBlue, textAlign: 'center' }}>{accountName}</Text>
                        </View>}
                        {!!accountName &&
                            <InputBox>
                                <Text>Amount</Text>
                                <View>
                                    <RightNairaSign />
                                    <Input
                                        value={amount}
                                        inputMode="numeric"
                                        cursorColor={theme.colors.zippaGrey}
                                        onChangeText={setAmount}
                                    />
                                </View>
                            </InputBox>
                        }

                        <ZippaButton text='Continue' disabled={!accountNumber || !bankName || !amount ? true : false} action={() => {
                            SheetManager.show('send-money', {
                                payload: {
                                    value: JSON.stringify({
                                        accountNumber,
                                        bankName,
                                        amount,
                                        accountName
                                    })
                                },
                            });
                        } } />
                    </ScreenContent>
                </KeyboardAvoidingView> */}
                <View style={{display: "flex", justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginVertical: 100}}>
                    <Text>Coming soon</Text>
                </View>
            </View>
        </>
    )
}
