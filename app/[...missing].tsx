import { Link } from 'expo-router';
import { Text, theme } from '../components/Themed';
import { View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hi there, we apologize</Text>
        <Text fontFamily='zippa-medium' fontSize={24}>This screen doesn't exist.</Text>
        <Link href="/screens/(tabs)/home" >
          <Text fontFamily='zippa-semibold' color={theme.colors.zippaGreen}>Return to home screen</Text>
        </Link>
      </View>
    </>
  );
}
