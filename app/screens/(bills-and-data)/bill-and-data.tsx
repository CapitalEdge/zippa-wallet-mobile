import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { ScreenContent, Text } from '../../../components/Themed'
import SettingsItem from '../../../components/more/SettingsItem';
import styled from 'styled-components/native'
import { SheetManager } from 'react-native-actions-sheet'
import { useBillsStore } from '../../../stores/feature/bills';


export default function funding() {
    const [allBillers] = useBillsStore(state => [state.allBillers]); 

    useEffect(() => {
        (async () => {
            await allBillers();
        })();
    }, []);

    return (
        <>
            <Stack.Screen options={{
                title: 'Bills and Data',
                headerShown: true,
                animation: 'none',
            }} />
            <ScreenContent>
                <View style={{marginVertical: 20}}>
                    <Text>Pay bills, buy data and subscribe your internet</Text>
                </View>
                {BillAndData.map(({ id, icon, name, sheet }: typeof BillAndData[0]) =>
                    <BillItem key={id} icon={icon} text={name} onPress={() => SheetManager.show(`${sheet}`)} />
                )}
            </ScreenContent>
        </>
    )
}


const BillAndData = [
    { id: 1, name: "Airtime", icon: "mobile-alt", sheet: "airtime" },
    { id: 2, name: "Mobile Data", icon: "wifi", sheet: "mobile-data" },
    { id: 3, name: "Electricity", icon: "bolt", sheet: "electricity" },
    { id: 4, name: "Cable TV", icon: "tv", sheet: "cable-tv" }
];

const BillItem = styled(SettingsItem)``