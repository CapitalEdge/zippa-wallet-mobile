import React, { useEffect, useState } from 'react'
import { Container, EditShowContainer, Text } from '../../../components/Themed'
import { PersonalInformationField } from '../../../helpers/types'
import styled from 'styled-components/native'
import { theme } from '../../../constants/Colors'
import { Stack, router } from 'expo-router'
import { MMKVStorage } from '../../../stores/mmkv-storage'
import { useAuthStore } from '../../../stores/feature/auth'
import { useGlobalStore } from '../../../stores/store'
import Toast from 'react-native-simple-toast';
import Ionicons from '@expo/vector-icons/Ionicons'
import ZippaButton from '../../../components/Button'
import { KeyboardAvoidingView } from 'react-native'


export default function personalInformation() {

  const userID = `ZW-U/` + parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(6).toString().replace(".", ""))
  const [userName, setUserName] = useState(userID)

  const setAppState = useGlobalStore(state => state.setAppState);

  const personalInformation: PersonalInformationField = {
    avatar: '',
    firstname: '',
    lastname: '',
    username: userName,
    address: '',
    state: '',
    city: '',
    dob: '',
    gender: '',
    phone: '',
  }
  const [userInfo, setUserInfo] = useState(personalInformation)



  const [userdata, saveUserDetails] = useAuthStore(state => [state.data, state.saveUserDetails]);

  //get Saved phone number
  useEffect(() => {
    const phoneNumber = MMKVStorage.getItem("@phone");
    setUserInfo({ ...userInfo, phone: phoneNumber as string })
  }, [userInfo.phone]);


  const __handleInfoUpdate = async () => {
    setAppState("LOADING");
    MMKVStorage.setItem("@firstname", userInfo.firstname);
    MMKVStorage.setItem("@lastname", userInfo.lastname);

    const variables = {
      id: userdata?.user?.id,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      username: userInfo.username,
      address: userInfo.address,
      phone: userInfo.phone
    };

    const res = await saveUserDetails(variables);
    if (res) {
      setAppState("IDLE");
      router.replace('/auth/(register)/congratulations');
    } else {
      setAppState("IDLE");
      Toast.showWithGravity(
        'Something went wrong. Try again',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    }
  }

  return (
    <>
      <Stack.Screen options={{
        headerBackVisible: false,
        title: 'Personal Information'
      }} />
      <Container>
        <PersonalInformationContent>
          <KeyboardAvoidingView>
            <Text fontSize={18} fontFamily='zippa-regular'>Complete the remaining steps to finish your account setup</Text>
            <InputBox>
              <Text fontSize={16} fontFamily='zippa-regular'>Firstname</Text>
              <Input
                onChangeText={(text: any) => setUserInfo(userInfo => ({ ...userInfo, firstname: text }))}
                value={userInfo.firstname}
                clearTextOnFocus
                textContentType='emailAddress'
                cursorColor={theme.colors.zippaBlack}
              />
            </InputBox>

            <InputBox>
              <Text fontSize={16} fontFamily='zippa-regular'>Lastname</Text>
              <Input
                onChangeText={(text: any) => setUserInfo(userInfo => ({ ...userInfo, lastname: text }))}
                value={userInfo.lastname}
                clearTextOnFocus
                cursorColor={theme.colors.zippaBlack}
              />
            </InputBox>
            <InputBox>
              <Text fontSize={16} fontFamily='zippa-regular'>Customer ID</Text>
              <Input
                value={userName}
                clearTextOnFocus
                cursorColor={theme.colors.zippaBlack}
                editable={false}
              />
            </InputBox>
            <InputBox>
              <Text fontSize={16} fontFamily='zippa-regular'>Address</Text>
              <Input
                onChangeText={(text: any) => setUserInfo(userInfo => ({ ...userInfo, address: text }))}
                value={userInfo.address}
                clearTextOnFocus
              />
            </InputBox>

            <ZippaButton text='Save' action={__handleInfoUpdate} /> 
        </KeyboardAvoidingView>
        </PersonalInformationContent>
      </Container>
    </>
  )
}

//#region styles
const PersonalInformationContent = styled.ScrollView`
  flex: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 0 5%;
  padding-top: 20px;
  background-color: ${theme.colors.zippaLight};
  `;

const InputBox = styled.View`
  margin: 20px 0;
  background-color: ${theme.colors.zippaWhite};
  border-radius: 10px; 
  padding: 10px;
`;

const Input = styled.TextInput`
  width: 100%;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.zippaGrey};
  padding: 5px 5px;
  font-size: 16px;
  font-family: 'zippa-regular';
  `;


const CreateAccountButton = styled.Pressable`
  width: 100%;
  height: 50px;
  background-color: ${theme.colors.zippaBlue};
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-top: 20px;
`;
//#endregion styles