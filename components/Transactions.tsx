import React from 'react';
import { theme } from '../constants/Colors';
import { Entypo, Feather } from '@expo/vector-icons';
import { Text } from './Themed';
import styled from 'styled-components/native';
import moment from 'moment';
import { SectionList, View } from 'react-native';
import _ from 'lodash';
import { router } from 'expo-router';
import { Slugify } from '../helpers/slugify';

/**
 * Renders a list of transactions, grouped by date.
 * @param data - The list of transactions to render.
 */
export default function Transactions({ data, showTitle = true }: { data: any[], showTitle?: boolean }): JSX.Element {
  // Sort the data by date, newest first.
  const sortedData = _.orderBy(data, ['node.created_at'], ['desc']);

  // Group the data by date.
  const groupedData = _.groupBy(sortedData, (item) => moment(item.node.created_at).format('ddd Do MMMM, YYYY.'));

  // Convert the grouped data into a format that can be used by SectionList.
  const sectionListData = Object.entries(groupedData).map(([title, data]) => ({
    title,
    data,
  }));

  return (
    <TransactionContainer>
      {!data?.length ? (
        <Text fontSize={14} style={{ textAlign: 'center' }}>
          Your recent transactions will appear here
        </Text>
      ) : (
        <SectionList
          scrollEnabled={false}
          sections={sectionListData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <TransactionItem onPress={() => router.push({
              pathname: '/screens/(transaction-details)/[details]', params: {
                details: Slugify(item?.node?.transaction_details?.savings_type?.name),
                data: JSON.stringify(item?.node)
              } })}>
              <Icon>
                {item?.node?.transaction_set === 'credit' ? (
                  <IconContainer>
                    <TIcon name="arrow-left" size={18} color={theme.colors.zippaGreen} />
                  </IconContainer>
                ) : (
                  <IconContainer>
                      <TIconAlt name="arrow-left" size={18} color={theme.colors.zippaRed} />
                  </IconContainer>
                )}
              </Icon>
              <Details>
                <DateAndTitle>
                  <View style={{ width: '65%' }}>
                    <Text fontSize={14} fontFamily="zippa-medium" style={{ textTransform: 'capitalize' }}>
                      {item?.node?.transaction_details?.savings_type?.name.replace(/-/g, ' ')}
                    </Text>
                  </View>
                  <View style={{ width: '35%', position: 'absolute', top: 20, right: -15 }}>
                    <Text fontSize={16} fontFamily="zippa-medium" color={theme.colors.zippaGreen}>
                      +₦{parseFloat(item?.node?.amount).toLocaleString('en')}
                    </Text>
                  </View>
                </DateAndTitle>
                {item?.node?.transaction_set !== 'credit' ? (
                  <Text fontSize={12} fontFamily="zippa-light">
                    This transaction failed.
                  </Text>
                ) : (
                  <Text fontSize={12} fontFamily="zippa-light">
                    {item?.node?.transaction_type?.name === 'Savings' ? (
                      <Text fontSize={12} fontFamily="zippa-light">
                        <Text fontSize={12} fontFamily="zippa-regular">
                          {moment(item?.node?.created_at).format('DD MMM, YYYY hh:mm A')}
                        </Text>
                      </Text>
                    ) : item?.node?.transaction_type?.name === 'loan' ? (
                      <Text fontSize={12} fontFamily="zippa-light">
                        A {item?.node?.transaction_type?.name} of{' '}
                        <Text fontSize={12} fontFamily="zippa-semibold">
                          ₦{item?.node?.amount}
                        </Text>{' '}
                        has been disbursed to your provided bank account successfully.
                      </Text>
                    ) : item?.node?.transaction_type?.name === 'deposit' ? (
                      <Text fontSize={12} fontFamily="zippa-light">
                        A {item?.node?.transaction_type?.name} of{' '}
                        <Text fontSize={12} fontFamily="zippa-semibold">
                          ₦{item?.node?.amount}
                        </Text>{' '}
                        was credited into your wallet balance successfully.
                      </Text>
                    ) : item?.node?.transaction_type?.name === 'transfer' ? (
                      'Transfer'
                    ) : item?.node?.transaction_type?.name === 'loan repayment' ? (
                      <Text fontSize={12} fontFamily="zippa-light">
                        A {item?.node?.transaction_type?.name} of{' '}
                        <Text fontSize={12} fontFamily="zippa-semibold">
                          ₦{item?.node?.amount}
                        </Text>{' '}
                        has been received towards clearing your debt successfully.
                      </Text>
                    ) : item?.node?.transaction_type?.name === 'withdrawal' ? (
                      'Withdrawal'
                    ) : (
                      'Unknown'
                    )}
                  </Text>
                )}
                <Text fontFamily="zippa-light" fontSize={10} style={{ textAlign: 'left' }}>
                  Transaction ID:{' '}
                  <Text fontFamily="zippa-light" fontSize={10} style={{ textTransform: 'uppercase' }}>
                    {item?.node?.transaction_reference}
                  </Text>
                </Text>
              </Details>
            </TransactionItem>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{paddingVertical: 10}}>
              <Text fontFamily='zippa-medium' fontSize={14}>{title}</Text>
            </View>
          )}
        />
      )}
    </TransactionContainer>
  );
}

const TransactionContainer = styled.View`
  width: 100%;
  padding: 0 5%;
  marginBottom: 50px;
`;

const TransactionItem = styled.Pressable`
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

const IconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.zippaLight};
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

const TIcon = styled(Feather)`
  transform: rotate(45deg);
`

const TIconAlt = styled(TIcon)`
transform: rotate(220deg);
`