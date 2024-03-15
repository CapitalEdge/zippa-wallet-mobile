import React, { useCallback, useEffect } from 'react'
import { Container } from '../../../components/Themed';
import SettingsItem from '../../../components/more/SettingsItem';
import { theme } from '../../../constants/Colors';
import { router } from 'expo-router';
import { useAuthStore } from '../../../stores/feature/auth';
import { useGlobalStore } from '../../../stores/store';
import Toast from 'react-native-simple-toast';
import styled from 'styled-components/native';
import { useUserStore } from '../../../stores/feature/users';
import { SETTINGSITEMS } from '../../../helpers/types';
import ZippaButton from '../../../components/Button';
import { View } from 'react-native';
import { MMKVStorage } from '../../../stores/mmkv-storage';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from 'expo-router';


export default function MoreScreen() {
  const focused = useNavigation().isFocused()
  

  const setAppState = useGlobalStore((state) => state.setAppState);
  const [userData, clearUserData, getUserData] = useUserStore(state => [state.userData, state.clearUserData, state.getUserData]);
  const [logout, setIsAuthenticated] = useAuthStore(state => [state.logout, state.setIsAuthenticated]);

  const handleLogout = () => {
    setAppState('LOADING');
    try {
      clearUserData(); //remove the user object from the state
      MMKVStorage.clearAll();
      setIsAuthenticated(false);
      logout(); // call the logout method
      setAppState('IDLE');
      Toast.showWithGravity(
        'Logout successful',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      router.replace('/auth/login');
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  const refetchData = useCallback(async () => {
    setAppState("LOADING");
    await getUserData(userData?.id)
    setAppState("IDLE");
  }, [userData])

  useEffect(() => {
    focused && refetchData()
  }, [])
  
  return (
    <Container>
      <SettingsContainer showsVerticalScrollIndicator={false}>
        {SettingsItems.map(({ id, icon, text, link, ext }: SETTINGSITEMS) =>

          <SettingsItem key={id} icon={icon} text={text} onPress={() => { ext ? WebBrowser.openBrowserAsync(link!) :  router.push(`/screens/${link}`)}} />
        )}
        <View style={{marginTop: 10, marginBottom: 50}}>
          <ZippaButton color={theme.colors.zippaRed} text='Logout' action={handleLogout} />
        </View>
      </SettingsContainer>
    </Container>
  );
}




const SettingsItems: SETTINGSITEMS[] = [
  {
    id: 1,
    icon: "edit",
    text: "Edit Personal Data",
    link: "personal-data",
    ext: false
  },
  {
    id: 2,
    icon: "lock",
    text: "Reset Transaction Pin",
    link: "reset-transaction-pin",
    ext: false
  },
  // {
  //   id: 4,
  //   icon: "cc-mastercard",
  //   text: "Manage Cards",
  //   ext: false
  // },
  {
    id: 5,
    icon: "user-secret",
    text: "KYC/Verification",
    link: "kyc-verification",
    ext: false
  },
 
  {
    id: 7,
    icon: "bookmark",
    text: "Privacy Policy",
    link: "https://zippawallet.com/privacy-policy/",
    ext: true
  },
  {
    id: 8,
    icon: "bookmark",
    text: "Terms of Use",
    link: "https://zippawallet.com/terms-of-use/",
    ext: true
  },
  {
    id: 9,
    icon: "at",
    text: "Social Media",
    link: "social-media",
    ext: false
  },
  {
    id: 6,
    icon: "question-circle",
    text: "FAQ",
    link: "https://zippawallet.com/#faq",
    ext: true
  },
];

const SettingsContainer = styled.ScrollView`
    width: 100%;
    height: 100%;
    padding: 0 5%;
`;
