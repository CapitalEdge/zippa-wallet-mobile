import React, { useCallback, useEffect, useState } from 'react'
import { theme } from '../constants/Colors'
import { StyleSheet } from 'react-native'
import { PinCode, PinCodeT } from '@anhnch/react-native-pincode';
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useLocalSearchParams } from 'expo-router'
import { useMMKV, useMMKVString } from 'react-native-mmkv';
import { useAuthStore } from '../stores/feature/auth';
import { MMKVStorage } from '../stores/mmkv-storage';
import Toast from 'react-native-simple-toast';
import { useUserStore } from '../stores/feature/users';
import { SheetManager } from 'react-native-actions-sheet';
import { useGlobalStore } from '../stores/store';
import { useTransferStore } from '../stores/feature/transfer';


export default function ConfirmationPin() {
    const {route} = useLocalSearchParams();

    const [checkTransactionPin, setTransactionPin] = useAuthStore(state => [state.checkTransactionPin, state.setTransactionPin]);
    const localSessionUser = JSON.parse(MMKVStorage.getItem('@auth-session') as string)?.state?.data?.user;

    const [pinConfirmed, setPinConfirmed] = useTransferStore(state => [state.pinConfirmed, state.setPinConfirmed])
    const setAppState = useGlobalStore(state => state.setAppState)
    const userId = localSessionUser?.id;
    const getUserData = useUserStore().getUserData;

    //get and set user name
    useEffect(() => {
        getUserData(userId);
    }, [userId]);

    const mmkv = useMMKV();
    const [pin, setPin] = useMMKVString('@transaction-pin', mmkv);
    const [pinMode, setPinMode] = useState(PinCodeT.Modes['Enter']);
    const [pinVisible, setPinVisible] = useState(true);


    //run once - checks and sets the user transaction pin from DB store
    useEffect(() => {
        (async () => {
            const transactionPin = await checkTransactionPin();
            if (transactionPin !== "") {
                MMKVStorage.setItem("@transaction-pin", transactionPin!)
            }
            return;
        })();

    }, []);

    //get the value of the use pincode
    useEffect(() => {
        const pincode = MMKVStorage.getItem("@transaction-pin");
        if (pin === pincode) {
            setPin(pin)
        }
        return;
    }, [pin]);


    const handleOnEnter = () => {
        setPinVisible(false)
        setPinConfirmed(!pinConfirmed);
        router.back();
    };

    return (
        <PinCode
            pin={pin}
            mode={pinMode}
            visible={pinVisible}
            styles={{
                main: { ...StyleSheet.absoluteFillObject, zIndex: 99, backgroundColor: theme.colors.zippaBlue, },
                enter: { ...EnterAndSet },
                set: EnterAndSet,
                locked: Locked,
            }}
            onSet={() => {}}
            onSetCancel={() => {}}
            onReset={() => {}}
            onEnter={() => {
                handleOnEnter()
            }}
            options={{
                allowReset: false,
                pinLength: 6,
                backSpace: <Ionicons name="backspace" size={30} color={theme.colors.zippaLight} />,
                lockIcon: <Ionicons name="lock-closed" size={30} color={theme.colors.zippaLight} />,
                maxAttempt: 6,
                lockDuration: 600000 * 1,
            }}
            textOptions={customTexts}
        />
    )
}


const customTexts: PinCodeT.TextOptions = {
    enter: {
        title: `Confirm transaction!`,
        subTitle: 'Enter PIN to complete transaction.',
    },
    locked: {
        title: 'Locked',
        subTitle: `Wrong PIN entered 5 times\nTemporarily locked for {{lockDuration}} minutes`,
    }
};

const EnterAndSet: PinCodeT.EnterSetStyles = {
    header: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: 100
    },
    title: { fontSize: 24 },
    pin: {
        width: 15,
        height: 15,
        borderRadius: 50,
    },
    enteredPin: {
        backgroundColor: theme.colors.zippaGreen,
        width: 15,
        height: 15,
        borderRadius: 50,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        marginTop: 20,

    },
    buttonText: {
        fontWeight: "700",
        color: `${theme.colors.zippaBlue}`
    }
}
const Locked: PinCodeT.LockedStyles = {
    title: { fontSize: 24 },
    subTitle: { fontSize: 16 },
}

