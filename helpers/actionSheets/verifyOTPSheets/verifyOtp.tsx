import { Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { VerifiedAfrica } from "../../../utilities/verified";
import { useState } from "react";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { useGlobalStore } from "../../../stores/store";
import Toast from 'react-native-simple-toast';
import { useUserStore } from "../../../stores/feature/users";
import { BVNKEY } from "../../../constants/Constants";
import { titleCase } from "../../titleCase";
import { InterSwitch } from "../../../utilities/isw";
import { Redirect, router } from "expo-router";

const interswitch = InterSwitch();

export default function VerifyOTP(props: SheetProps<{ value: string }>) {

    const setAppState = useGlobalStore(state => state.setAppState)
    const [userData, updateUser] = useUserStore(state => [state.userData, state.updateUser])
    const data = JSON.parse(props.payload?.value!);
    const [code, setCode] = useState<string>()


    const verify = async () => {
        SheetManager.hide('verify-otp');
        setAppState("LOADING")
        switch (data?.identity) {
            case "bvn":
                const otp = VerifiedAfrica(BVNKEY!);
                try {
                    const otpResponse = await otp.verify({
                        verificationType: "BVN-FULL-DETAILS-IGREE",
                        transactionReference: data?.transactionReference,
                        otp: code
                    });
                    if (otpResponse?.verificationStatus === "VERIFIED") {
                        const bvnInput = {
                            firstname: titleCase(otpResponse?.response?.firstName),
                            lastname: titleCase(otpResponse?.response?.lastName),
                            gender: titleCase(otpResponse?.response?.gender),
                            dob: otpResponse?.response?.dob,
                            user_identity_type: data?.idType,
                            user_identity_number: data?.identityNumber,
                            verified: true,
                        }
                        //updateUserMutation
                        try {
                            const userUpdated = await updateUser(userData?.id, bvnInput)
                            if (userUpdated) {
                                const payload = {
                                    firstName: bvnInput?.firstname,
                                    lastName: bvnInput?.lastname,
                                }
                                //call generate account method
                                const data = await interswitch.generateAccounNumber(`${payload.firstName + ' ' + payload.lastName + ' ZPW'}`, userData?.id);                                
                                if (data) {
                                    setAppState("IDLE")
                                    Toast.showWithGravity(
                                        'KYC Verification Complete!',
                                        Toast.LONG,
                                        Toast.BOTTOM,
                                    );
                                    router.push('/screens/kyc-complete');
                                }
                            }
                        } catch (error) {
                            Toast.showWithGravity(
                                'Something went wrong. Try again.',
                                Toast.SHORT,
                                Toast.BOTTOM,
                            );
                            setAppState("IDLE")
                            console.log(error)
                        }
                        
                    } else {
                        Toast.showWithGravity(
                            'KYC Verification failed!',
                            Toast.SHORT,
                            Toast.BOTTOM,
                        );
                        setAppState("IDLE")
                    }
                } catch (error) {
                    console.log(error)
                }
                break;          
            default:
                break;
        }
    }
    
    return (
        <SheetWrapper sheetName="verify-otp" gestureEnabled={false} hideCloseButton={true}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text fontFamily="zippa-medium" style={{ textAlign: 'center', marginBottom: 10 }}>Verify OTP</Text>
                <Text fontFamily="zippa-regular" fontSize={12} color={theme.colors.zippaBlack} style={{ textAlign: "center" }}>{data?.message}</Text>
                <View style={{ width: "90%", justifyContent: "center", alignSelf: "center", height: 80  }}>
                    <OTPInputView pinCount={6} autoFocusOnLoad={false} codeInputFieldStyle={{
                        color: theme.colors.zippaBlack,
                        fontFamily: "zippa-medium",
                        borderColor: theme.colors.zippaGrey,
                        borderRadius: 10,
                        borderBottomWidth: 2
                    }} codeInputHighlightStyle={{
                        borderColor: theme.colors.zippaBlack
                    }}
                        onCodeChanged={(code) => setCode(code)} />
                </View>
            
                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} text="Verify" action={() => {
                        verify();
                    }} disabled={!code && true } />
                </View>
            </ScrollView>
        </SheetWrapper>
    );
}
