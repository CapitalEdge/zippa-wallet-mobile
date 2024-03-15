import React, { useState } from 'react';
import { Container, EditShowContainer, Input, ScrollScreen, Text } from '../../../components/Themed';
import styled from 'styled-components/native';
import { theme } from '../../../constants/Colors';
import { useUserStore } from '../../../stores/feature/users';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import ZippaButton from '../../../components/Button';
import { View } from 'react-native';
import moment from 'moment';

export default function PersonalDataScreen() {
    const userData = useUserStore(state => state.userData);
    const [editable, setEditable] = useState(true);

    const [edit, setEdit] = useState(false);
    const [text, setText] = useState('');
    const date = moment(userData?.created_at).format("Do MMM, YYYY");

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Personal data",
                    headerShown: true
                }} />
            <Container>
                <DataContent>
                    <Text>Your personal information</Text>
                    <InputBox>
                        <Text>Full name</Text>
                        <Input
                            value={userData?.firstname + " " + userData?.lastname}
                            clearTextOnFocus
                            textContentType='emailAddress'
                            cursorColor={theme.colors.zippaBlack}
                            inputMode='text'
                            clearButtonMode='while-editing'
                            editable={!editable}
                            style={{ color: editable ? theme.colors.zippaGrey : theme.colors.zippaGrey}}
                        />
                    </InputBox>
                    <InputBox>
                        <Text>Residential address</Text>
                        <Input
                            value={userData?.address}
                            placeholder={userData?.address}
                            clearTextOnFocus
                            textContentType='emailAddress'
                            cursorColor={theme.colors.zippaBlack}
                            inputMode='text'
                            clearButtonMode='while-editing'
                            editable={!editable}
                            style={{ color: editable ? theme.colors.zippaGrey : theme.colors.zippaGrey }}
                        />
                    </InputBox>
                    <InputBox>
                        <Text>Email address</Text>
                        <Input
                            value={userData?.email}
                            clearTextOnFocus
                            textContentType='emailAddress'
                            cursorColor={theme.colors.zippaBlack}
                            inputMode='email'
                            clearButtonMode='while-editing'
                            editable={!editable}
                            style={{ color: editable ? theme.colors.zippaGrey : theme.colors.zippaGrey }}
                        />
                    </InputBox>
                    <InputBox>  
                        <Text>Phone number</Text>
                        <Input
                            value={userData?.phone}
                            clearTextOnFocus
                            textContentType='emailAddress'
                            cursorColor={theme.colors.zippaBlack}
                            inputMode='text'
                            clearButtonMode='while-editing'
                            editable={!editable}
                            style={{ color: editable ? theme.colors.zippaGrey : theme.colors.zippaGrey }}
                        />
                    </InputBox>
                    <InputBox>
                        <Text>Date of birth</Text>
                        <Input
                            placeholder={!userData?.dob ? 'Complete KYC' :  userData?.dob}
                            clearTextOnFocus
                            textContentType='none'
                            cursorColor={theme.colors.zippaBlack}
                            inputMode='text'
                            clearButtonMode='while-editing'
                            editable={!editable}
                            style={{ color: editable ? theme.colors.zippaGrey : theme.colors.zippaGrey }}
                        />
                    </InputBox>
                    <InputBox>
                        <Text>ID Number</Text>
                        <Input
                            placeholder={!userData?.user_identity_number ? 'Complete KYC' : userData?.user_identity_number}
                            clearTextOnFocus
                            textContentType='none'
                            cursorColor={theme.colors.zippaBlack}
                            inputMode='text'
                            clearButtonMode='while-editing'
                            editable={!editable}
                            style={{ color: editable ? theme.colors.zippaGrey : theme.colors.zippaGrey }}
                        />
                    </InputBox>
                    <InputBox>
                        <Text>customer ID</Text>
                        <Input
                            onChangeText={setText}
                            value={userData?.username}
                            clearTextOnFocus
                            textContentType='name'
                            cursorColor={theme.colors.zippaBlack}
                            inputMode='text'
                            clearButtonMode='while-editing'
                            editable={false}
                            style={{ color: editable ? theme.colors.zippaBlack : theme.colors.zippaGrey }}
                        />
                        {/* <EditShowContainer onPress={() => setEdit(!edit)}>
                            <Ionicons name="create" size={22} color={edit ? theme.colors.zippaGreen : theme.colors.zippaBlack} />
                        </EditShowContainer> */}
                    </InputBox>
                    <InputBox>
                        <Text>Registration date</Text>
                        <Input
                            value={date}
                            clearTextOnFocus
                            textContentType='none'
                            cursorColor={theme.colors.zippaBlack}
                            inputMode='text'
                            clearButtonMode='while-editing'
                            editable={!editable}
                            style={{ color: editable ? theme.colors.zippaGrey : theme.colors.zippaGrey }}
                        />
                    </InputBox>

                    <View style={{marginBottom: 50}}>
                        <ZippaButton text='Save changes' action={() => alert("submited")} disabled={!edit && true} />
                    </View>
                </DataContent>
            </Container></>
  )
}



const DataContent = styled(ScrollScreen)`
  display: flex;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 0 5%;
  padding-top: 20px;
  `;

const InputBox = styled.View`
  margin: 20px 0;
  background-color: ${theme.colors.zippaWhite};
  border-radius: 10px; 
  padding: 10px;
`;