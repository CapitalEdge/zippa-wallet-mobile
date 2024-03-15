import { Text } from '../../components/Themed';
import { theme } from '../../constants/Colors';
import { Image, View } from 'react-native';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function HeaderComponent({data}: any) {
  return (
    <Header>
      <NameContainer>
        <View style={{ flex: 1 }}>
          <Text fontSize={18} fontFamily='zippa-bold'>
            Welcome, {data?.firstname}.
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <SaverDot />
            <Text fontSize={10} fontFamily='zippa-semibold' color={theme.colors.zippaGreen}>{data?.username}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <View style={{ marginTop: 10 }}>
            <SaverDot style={{ backgroundColor: theme.colors.zippaRed, position: 'absolute', zIndex: 1, left: 10, top: -2 }} />
            <Ionicons name="notifications-sharp" size={20} color={theme.colors.zippaGreen} />
          </View>
          <Avatar onPress={() => router.push('/screens/(tabs)/more')}>
            {!data?.avatar ?
              <Image source={require('../../assets/images/user1.png')} style={{ width: 35, height: 35, borderRadius: 50 }} /> :
              <Image source={{ uri: data?.avatar }} style={{ width: 35, height: 35, borderRadius: 50 }} />}
          </Avatar>
        </View>
      </NameContainer>
      <Quote>
        <Text fontSize={12} color={theme.colors.zippaGrey} style={{ fontStyle: 'italic' }}>Save everyday. Save for the future.</Text>
      </Quote>
    </Header>
  )
}



const NameContainer = styled.View`
  width: 100%;
  flex-direction: row;
  `;

const Header = styled.View`
  width: 100%;
  margin-top: 0px;
  padding: 10px 5%;
  margin-top: 50px;
  flex-direction: column;
  justify-content: space-between;
`;

const Quote = styled.View`
  width: 100%;
`;

export const SaverDot = styled.View<{color?: string}>`
  width: 10px;
  height: 10px;
  border-radius: 50px;
  background-color: ${(props: { color: string; }) => props.color || theme.colors.zippaGreen};
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  margin-top: 4px`

export const Avatar = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-color: ${theme.colors.zippaSubtle};
  align-items: center;
  justify-content: center;
  margin-right: 5px
`;
