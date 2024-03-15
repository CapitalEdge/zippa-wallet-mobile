import React, { useState } from 'react';
import { Stack, router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Input, InputBox, ScreenContent, ScrollScreen, Text, theme } from '../../../components/Themed';
import { useUserStore } from '../../../stores/feature/users';
import { Picker } from '@react-native-picker/picker';
import ZippaButton from '../../../components/Button';
import { IDENTITY_TYPE } from '../../../helpers/graphQL/queries';
import useFetchQuery from '../../../hooks/useFetchQuery';
import { VerifiedAfrica } from '../../../utilities/verified';
import Toast from 'react-native-simple-toast';
import { useGlobalStore } from '../../../stores/store';
import { SheetManager } from 'react-native-actions-sheet';
import { BVNKEY } from '../../../constants/Constants';


export default function KycVerification() {
    const userData = useUserStore(state => state.userData);
    const setAppState = useGlobalStore(state => state.setAppState)
    const [identity, setIdentity] = useState<string>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [identityNumber, setIdentityNumber] = useState<string>();
    const [idType, setIdType] = useState<any>();
    const [transactionReference, setTransactionReference] = useState()

    const [showToken, setShowToken] = useState(false)
    const [tokenMethod, setTokenMethod] = useState([]) 

    //get identity type
    const { data: identityType } = useFetchQuery(IDENTITY_TYPE, {});

    const handleKYC = async () => {
        setAppState("LOADING");
        switch (identity) {
            case "bvn":
                const BVN = VerifiedAfrica(BVNKEY!);
                const bvnResponse = await BVN.verify({
                    idNumber: identityNumber,
                    verificationType: "BVN-FULL-DETAILS-IGREE",
                });
               
                if (bvnResponse?.verificationStatus === "VERIFIED") {
                    if (bvnResponse?.response?.methods) {
                        setShowToken(true)
                        setTokenMethod(bvnResponse?.response?.methods)
                        setTransactionReference(bvnResponse?.transactionReference)
                    }
                    setAppState("IDLE");
                    Toast.showWithGravity(
                        'Choose verification method',
                        Toast.SHORT,
                        Toast.BOTTOM,
                    );

                } else {
                    setAppState('IDLE');
                    Toast.showWithGravity(
                        'BVN Validation failed',
                        Toast.SHORT,
                        Toast.BOTTOM,
                    );
                }
                break;
            default:
                break;
        }
    };

    const checkDBId = (id: number) => {
        const result = identityType?.identity_typeCollection?.edges.find((item: {node : {id: number}}) => item?.node?.id === id)
        return result?.node?.name
    } 

    const sendToken = async (method: any) => {
        setAppState("LOADING")

        const otp = VerifiedAfrica(BVNKEY!);
        const otpResponse = await otp.verify({
            verificationType: "BVN-FULL-DETAILS-IGREE",
            transactionReference: transactionReference,
            otpMethod: method
        });
        if (otpResponse.response.message) {
            setAppState("LOADED")
            SheetManager.show('verify-otp', {
                payload: {
                    value: JSON.stringify({
                        method: method,
                        identity,
                        identityNumber,
                        message: otpResponse.response.message,
                        transactionReference,
                        idType,
                    })
                }
            })
            Toast.showWithGravity(
                'Enter OTP',
                Toast.SHORT,
                Toast.BOTTOM,
            );
        } else {
            //abort the oeration after 1min
            setTimeout(() => {
                otp.controller.abort()
                setAppState("LOADED")
                Toast.showWithGravity(
                    'Operation timed out. Retry!',
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            }, 60000);
        }
        
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "KYC Verification",
                    headerShown: true 
                }} />
            <ScrollScreen>
                <ScreenContent>
                    <View style={{ marginTop: 20 }}>
                        <Text>Swiftly verify your identity to complete the KYC verification</Text>
                    </View>
                    <InputBox>
                        <Text>Full name</Text>
                        <View style={{ flexDirection: 'row'}}>
                            <Input
                                defaultValue={userData?.firstname}
                                value={firstName}
                                editable={false}
                                onChangeText={setFirstName}
                                placeholder={`Firstname`}
                                style={{
                                    width: '50%'
                                }}
                            />
                            <Input
                                defaultValue={userData?.lastname}
                                value={lastName}
                                editable={false}
                                onChangeText={setLastName}
                                placeholder={`Lastname`}
                                style={{
                                    width: '50%'
                                }}
                            />
                        </View>
                    </InputBox> 
                    {userData?.verified && 
                        <View>
                            <InputBox>
                                <Text>Date of Birth</Text>
                                <Input
                                    defaultValue={userData?.dob}
                                    editable={false}
                                />
                            </InputBox>
                            <InputBox>
                                <Text>Gender</Text>
                                <Input
                                    defaultValue={userData?.gender}
                                    editable={false}
                                />
                            </InputBox>
                        </View>
                    }
                   
                    <InputBox>
                        <Text>Proof of ID</Text>
                        {}
                        <Picker
                            selectedValue={identity}
                            onValueChange={(itemValue: string) => {
                                setIdentity(itemValue)
                                setIdType(itemValue === "bvn" && 4)
                            }
                            }
                            enabled={!userData?.user_identity_type ? true : false}>
                            <Picker.Item fontFamily="zippa-semibold" label={checkDBId(userData?.user_identity_type) ?? "Select ID proof"} value="" />
                            {identityType?.identity_typeCollection?.edges.map((item: { node: { id: React.Key | null | undefined; name: string, short_name: string } }) => <Picker.Item key={item?.node?.id} fontFamily="zippa-semibold" label={item?.node?.name} value={item?.node?.short_name} />)}
                        </Picker>
                    </InputBox>
                    {identity && <InputBox>
                        <Text>ID number</Text>
                        <Input
                            value={!userData?.user_identity_number ? identityNumber : userData?.user_identity_number}
                            editable={true}
                            onChangeText={setIdentityNumber}
                        />
                    </InputBox>
                    }
                    {showToken && <InputBox>
                        <Text>Confirm OTP method</Text>
                        {tokenMethod?.map((item: any) => <Pressable key={item?.method} onPress={() => {
                            setShowToken(!showToken); sendToken(item?.method);
                        }} style={{ padding: 10, backgroundColor: theme.colors.zippaSubtle, marginVertical: 5, borderRadius: 5 }}>
                            <Text style={{ fontSize: 12 }}>{item?.hint}</Text>
                        </Pressable>)}
                    </InputBox>
                    }
                    <View style={{ paddingVertical: 20 }}>
                        <ZippaButton text={'Verify'} action={handleKYC} disabled={userData?.verified && true} />
                    </View>
                </ScreenContent>
            </ScrollScreen>
        </>
    );
}

