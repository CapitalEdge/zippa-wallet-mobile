/**
 * This file contains the layout for the application tabs.
 * It uses the 'expo-router' library to handle navigation between tabs.
 * Each tab is represented by a 'Tabs.Screen' component.
 * The 'TabLayout' function component is exported as the default export.
 */

// Importing required libraries and components
import { theme } from '../../../constants/Colors';
import { Tabs } from 'expo-router';
import { ActivityIndicator, Image } from 'react-native';
import { TabBarIcon } from '../../../components/Icons';
import { FontAwesome5, AntDesign, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Avatar, SaverDot } from '../../../components/home/Header';
import { Text } from '../../../components/Themed';
import { MMKVStorage } from '../../../stores/mmkv-storage';
import { useToggleStore } from '../../../stores/feature/toggle';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-simple-toast';
import { useState } from 'react';
import { createAvaterUrl, uploadAvatar } from '../../../utilities/userAvatar';

/**
 * TabLayout function component.
 * It uses the 'useAuthStore' and 'useUserStore' hooks to fetch user data.
 * It also uses the 'useMemo' and 'useEffect' hooks to handle side effects.
 */
function TabLayout() {

  const userData = JSON.parse(MMKVStorage.getItem('@user-data') as string)?.state?.userData;
  const [modalVisible, toggleModalVisible] = useToggleStore(state => [state.modalVisible, state.toggleModalVisible]);

  const [loading, setLoading] = useState(false);


  const pickImage = async () => {
    const FileName = Math.random().toString(36).slice(2, 12);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'denied') {
      Toast.showWithGravity(
        'Permission denied. Enable the permission in the Settings app.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setLoading(true);
      await uploadAvatar({ userId: userData?.id, base64Image: result?.assets[0]?.base64, fileName: FileName });
      const uploaded = await createAvaterUrl({ userId: userData?.id, fileName: FileName });
      if (uploaded?.signedUrl) {
        Toast.showWithGravity(
          'Profile picture updated.',
          Toast.SHORT,
          Toast.BOTTOM,
        );
        setLoading(false);
      } else {
        Toast.showWithGravity(
          'An error occured. Try again.',
          Toast.SHORT,
          Toast.BOTTOM,
        );
        setLoading(false);
      }
      setLoading(false);
    }
  };

  // Rendering the tab layout
  return (
    <>
      <StatusBar style='light' backgroundColor={theme.colors.zippaBlue} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.zippaGreen,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.zippaBlue,
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 25,
            width: '90%',
            alignSelf: 'center',
            height: 60,
            borderRadius: 50,
            zIndex: 1,
          },
        }}>
        {/* Home tab */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <TabBarIcon size={30} IconName={MaterialCommunityIcons} name="home-analytics" color={color} />,
          }}
        />
        {/* Save tab */}
        <Tabs.Screen
          name="save"
          options={{
            title: 'Save',
            tabBarIcon: ({ color }) => <TabBarIcon size={28} IconName={MaterialCommunityIcons} name="piggy-bank" color={color} />,
          }}
        />
        {/* Transaction tab */}
        <Tabs.Screen
          name="transaction"
          options={{
            headerShown: true,
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: theme.colors.zippaBlue,
            },
            title: 'Transactions',
            tabBarIcon: ({ color }) => <TabBarIcon size={28} IconName={MaterialIcons} name="analytics" color={color} />,
            headerRightContainerStyle: {
              paddingEnd: 20
            },
            headerLeftContainerStyle: {
              paddingEnd: 20
            },
            headerRight: () => (
              <AntDesign name="customerservice" size={24} color={theme.colors.zippaGrey} onPress={() => toggleModalVisible(!modalVisible)} />
            ),
          }}
        />
        {/* Loan tab */}
        <Tabs.Screen
          name="loan"
          options={{
            title: 'Loan',
            tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="money-bill-wave" color={color} />,
          }}
        />
        {/* More tab */}
        <Tabs.Screen
          name="more"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="layers-plus" color={color} />,
            headerShown: true,
            headerTitle: () => (
              <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar onPress={pickImage}>
                  {!userData?.avatar ?
                    <Image source={require('../../../assets/images/user1.png')} style={{ width: 40, height: 40, borderRadius: 50 }} /> :
                    <Image source={{ uri: userData?.avatar }} style={{ width: 40, height: 40, borderRadius: 50 }} />}
                  <Ionicons name="ios-add-circle" size={18} color={theme.colors.zippaSubtle} style={{ position: 'absolute', left: 25, bottom: -3 }} />
                  {loading && <ActivityIndicator size={24} color={theme.colors.zippaGreen} style={{ position: 'absolute' }} />}
                </Avatar>
                <Text color={theme.colors.zippaWhite} fontFamily='zippa-semibold' style={{ marginVertical: 10 }}>{userData?.firstname + " " + userData?.lastname}</Text>
                <View style={{ flexDirection: 'row', marginTop: -10 }}>
                  <SaverDot color={theme.colors.zippaGreen} />
                  <Text color={theme.colors.zippaSubtleGreen} fontFamily='zippa-regular' fontSize={12} style={{}}>{userData?.username}</Text>
                </View>
              </View>
            ),
            headerLeftContainerStyle: {
              paddingLeft: 15,
              marginTop: -100
            },
            headerRightContainerStyle: {
              paddingRight: 15,
              marginTop: -100
            },
            headerRight: () => (
              <View style={{ marginTop: 10 }}>
                <SaverDot style={{ backgroundColor: theme.colors.zippaRed, position: 'absolute', zIndex: 1, left: 10, top: -2 }} />
                <Ionicons name="notifications-sharp" size={24} color={theme.colors.zippaGrey} />
              </View>
            ),
            headerLeft: () => (
              <AntDesign name="customerservice" size={24} color={theme.colors.zippaGrey} onPress={() => toggleModalVisible(!modalVisible)} />
            ),
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: theme.colors.zippaBlue,
              height: 200,
            },
            headerTitleAlign: 'center'
          }}
        />
      </Tabs>
    </>
  );
}

// Exporting the TabLayout function component
export default TabLayout;