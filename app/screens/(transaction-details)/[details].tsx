import React from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Container, ScreenContent, Text, theme } from '../../../components/Themed'
import { View } from 'react-native'
import { EvilIcons, Feather } from '@expo/vector-icons'
import ZippaButton from '../../../components/Button'
import moment from 'moment'
import styled from 'styled-components/native'

const TransactionDetails = () => {
    const params = useLocalSearchParams();
    const data  = JSON.parse(params?.data as any)
  return (
      <>
          <Stack.Screen options={{
              title: 'Transaction Receipt',
              animation: 'none',
              presentation: 'modal',
              headerBackVisible: false,
              headerTitleAlign: "center"
          }} />
          <Container>
              <ScreenContent style={{ justifyContent: 'center', alignItems: 'center', }}>
                  <View style={{ padding: 40, backgroundColor: theme.colors.zippaSubtleGreen, borderRadius: 50,  width: 80, height: 80, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position:'relative' }}>
                      <Feather name="check" color={theme.colors.zippaGreen} size={40} style={{ position: 'absolute' }} />
                  </View>

                  <View style={{ paddingVertical: 5, alignItems: 'center' }}>
                      <Text fontFamily='zippa-semibold' fontSize={18}>Success</Text>
                      <Text fontSize={14}>Your transaction was successful</Text>
                  </View>
                  <Divider />
                  <View style={{ width: '90%', height: 100, padding: 20, backgroundColor: theme.colors.zippaWhite, alignItems: 'center', borderRadius: 10, marginTop: 30, borderWidth: 1, borderColor: theme.colors.zippaSubtle }}>
                      <Text fontFamily="zippa-semibold" fontSize={32} color={theme.colors.zippaGreen}>₦{parseFloat(data?.amount).toLocaleString('en')}</Text>
                      <Text fontFamily="zippa-regular" fontSize={12} color={theme.colors.zippaBlue}>Transaction amount</Text>
                  </View>
                  <View style={{width: '90%', display: 'flex', flexDirection: 'column', justifyContent:'flex-start', paddingVertical: 20}}>
                      <View>
                          <Text fontSize={14} color={theme.colors.zippaGrey}>Transaction details:</Text>
                          <Text fontSize={14} fontFamily="zippa-medium" style={{ textTransform: "capitalize" }}>{data?.transaction_type?.name} - {data?.transaction_details?.savings_type?.name.replace(/-/g, " ")}</Text>
                          <Text fontSize={12}>₦{data?.amount.toLocaleString() + " " + data?.transaction_details?.name + " zippa wallet " + data?.transaction_details?.savings_type?.name.replace(/-/g, " ")} transaction</Text>
                      </View>
                      <Divider />
                      <View>
                          <Text fontSize={14} color={theme.colors.zippaGrey}>Date:</Text>
                          <Text fontSize={14} fontFamily="zippa-medium">{moment(data?.created_at).format("DD MMMM, YYYY - hh:mm A")}</Text>
                      </View>
                      <Divider />
                      <View>
                          <Text fontSize={14} color={theme.colors.zippaGrey}>Transaction ID:</Text>
                          <Text fontSize={14} fontFamily="zippa-medium">{data?.transaction_reference.toUpperCase()}</Text>
                      </View>
                      <Divider />
                  </View>
                  <View style={{width: "90%"}}>
                      <ZippaButton text="Done" action={() => router.back()} />
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
 marginVertical: 20px;
`