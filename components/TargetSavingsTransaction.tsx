import React from 'react'
import { theme } from '../constants/Colors'
import { Entypo } from '@expo/vector-icons'
import { Text } from './Themed'
import styled from 'styled-components/native'
import moment from 'moment'
import { View } from 'react-native'

export default function TargetSavingsTransactions({ data }: any): JSX.Element {
 
    return (
        <TransactionContainer showsVerticalScrollIndicator={false}>
            {!data ? <Text fontSize={14} style={{ textAlign: 'center', paddingVertical: 50 }}>Your recent transactions will appear here</Text> : data?.map((item: any) => (
                <TransactionItem key={item?.node?.id}>
                    <Icon>
                        <IconSuccessContainer>
                            <Entypo name="arrow-long-up" size={18} color={theme.colors.zippaLightBlue} />
                        </IconSuccessContainer>
                    </Icon>
                    <Details>
                        <DateAndTitle>
                            <View style={{ width: '65%' }}>
                                <Text fontSize={14} style={{ textTransform: "capitalize" }}>Target savings top up</Text>
                            </View>
                            <View style={{ width: '35%', position: 'absolute', top: 20, right: -15 }} >
                                <Text fontFamily="zippa-semibold" fontSize={16} color={theme.colors.zippaLightBlue}>+₦{parseFloat(item?.node?.transaction_details?.total_amount).toLocaleString('en')}</Text> 
                            </View>
                        </DateAndTitle>
                        <Text fontSize={12} fontFamily='zippa-light'>
                            <Text fontSize={12}>{moment(item?.node?.created_at).format("DD MMM, YYYY | hh:mm A")}
                            </Text>
                        </Text>
                        <Text fontFamily="zippa-light" fontSize={10} style={{ textAlign: 'left' }}>Transaction ID: <Text fontFamily="zippa-light" fontSize={10} style={{ textTransform: "uppercase" }}>{item?.node?.transaction_reference}</Text></Text>
                    </Details>
                </TransactionItem>
            ))}

        </TransactionContainer>
    )
}


const TransactionContainer = styled.ScrollView`
    width: 100%;
    height: 70%;
    margin-top: 10px;
    `;
const TransactionItem = styled.View`
    flexDirection: row;
    width: 100%;
    height: auto;
    padding: 10px 0;
    border-bottom-width: 1px;
    border-style: solid;
    background: white;
    padding: 15px;
    border-color: ${theme.colors.zippaSubtle};
    border-radius: 15px;
    margin: 10px 0 5px 0;
    gap: 15px;
    `;

const Icon = styled.View`
    width: 10%;
    justify-content: center;
    `;

const IconSuccessContainer = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: ${theme.colors.zippaSubtle};
    padding: 10px;
    border-radius: 50px;
    width: 40px;
    height: 40px;
    `;


const Details = styled.View`
    flex: 1;
    width: 85%;
`;

const DateAndTitle = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    `;