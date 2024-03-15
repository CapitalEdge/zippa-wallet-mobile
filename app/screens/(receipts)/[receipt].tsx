import React from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Container, NairaSign, ScreenContent, Text, theme } from '../../../components/Themed'
import { View } from 'react-native'
import { EvilIcons, Feather } from '@expo/vector-icons'
import ZippaButton from '../../../components/Button'
import moment from 'moment'
import styled from 'styled-components/native'
import { ThousandSeparator } from '../../../helpers/thousandSeparator'

const TransactionDetails = () => {
    const params = useLocalSearchParams();
    const data = JSON.parse(params?.details as string);
    return (
        <>
            <Stack.Screen options={{
                title: 'Receipt',
                animation: 'none',
                presentation: 'modal',
                headerBackVisible: false,
                headerTitleAlign: "center",
            }} />
            <Container>
                <ScreenContent style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <View style={{ padding: 40, backgroundColor: theme.colors.zippaSubtleGreen, borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'relative' }}>
                        <Feather name="check" color={theme.colors.zippaGreen} size={40} style={{ position: 'absolute' }} />
                    </View>

                    <View style={{ paddingVertical: 5, alignItems: 'center' }}>
                        <Text fontFamily='zippa-semibold' fontSize={18}>Success</Text>
                        <Text fontSize={14}>Your transaction was successful</Text>
                    </View>
                    <Divider />
                    <View style={{ width: '90%', height: 100, padding: 20, backgroundColor: theme.colors.zippaWhite, alignItems: 'center', borderRadius: 10, marginTop: 30, borderWidth: 1, borderColor: theme.colors.zippaSubtle }}>
                        <Text fontFamily="zippa-semibold" fontSize={32} color={theme.colors.zippaGreen}>{NairaSign()}{ThousandSeparator(String(data?.ApprovedAmount / 100))}{`.00`}</Text>
                        <Text fontFamily="zippa-regular" fontSize={12} color={theme.colors.zippaBlue}>Transaction amount</Text>
                    </View>
                    <View style={{ width: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingVertical: 20 }}>
                        <View>
                            <Text fontSize={14} color={theme.colors.zippaGrey}>Transaction details:</Text>
                            <Text fontSize={14} fontFamily="zippa-medium" style={{ textTransform: "capitalize" }}>{data?.BillerName} {data?.ItemName}</Text>
                            <Text fontSize={14} fontFamily="zippa-medium" style={{ textTransform: "uppercase" }}>{data?.TransactionRef}</Text>
                        </View>
                        <Divider />
                        <View>
                            <Text fontSize={14} color={theme.colors.zippaGrey}>Date:</Text>
                            <Text fontSize={14} fontFamily="zippa-medium">{moment().format("DD MMMM, YYYY - hh:mm A")}</Text>
                        </View>
                        <Divider />
                        <View>
                            <Text fontSize={14} color={theme.colors.zippaGrey}>Transaction ID:</Text>
                            <Text fontSize={14} fontFamily="zippa-medium">{`ZWISW|` + data?.TransactionRef.toUpperCase()}</Text>
                        </View>
                        <Divider />
                    </View>
                    <View style={{ width: "90%" }}>
                        <ZippaButton text="Done" action={() => router.push('/screens/(bills-and-data)/bill-and-data')} />
                    </View>
                </ScreenContent>
            </Container>
        </>
    )
}

export default TransactionDetails



const Divider = styled.View`
 width: 90%; 
 border-bottom-width: 1px; 
 border-bottom-color: ${theme.colors.zippaGrey}; 
 border-style: dashed;
 marginVertical: 10px;
`