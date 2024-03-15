import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Text } from '../components/Themed';
import { theme } from '../constants/Colors';
import styled from 'styled-components/native';
import { router } from 'expo-router';

export default function OnboardingScreen(): JSX.Element {

    const _renderItem = ({ item }: { item: any }) => {
        return (
            <View key={item.key} style={{ width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.zippaGreen }}>
                <Text fontSize={52} fontFamily='zippa-bold' color={theme.colors.zippaBlue} style={{ textAlign: 'center' }}>{item.title}</Text>
                <Text color={theme.colors.zippaBlue} style={{ marginBottom: 50 }}>{item.text}</Text>
                <Image source={item.image} />
            </View>

        );
    }
    const _renderNextButton = () => {
        return (
            <OnboardingButton>
                <MaterialIcons
                    name="arrow-forward-ios"
                    color={theme.colors.zippaLight}
                    size={20}
                />
            </OnboardingButton>
        );
    };
    const _renderDoneButton = () => {
        return (
            <GetStartedButton>
                <Text fontSize={12} color={theme.colors.zippaLight}>
                    Get Started
                </Text>
            </GetStartedButton>
        );
    };

    return (
        <AppIntroSlider
            renderItem={_renderItem}
            data={slides}
            renderDoneButton={_renderDoneButton}
            renderNextButton={_renderNextButton}
            onDone={() => { router.replace('/auth') }}
        />
    );
}


const slides = [
    {
        key: 'one',
        title: 'Save more efficiently',
        text: 'Save on goals. Effortless stack away cash',
        image: require('../assets/images/savemore2.png'),
    },
    {
        key: 'two',
        title: 'Transactions just in time',
        text: 'We make things a bit easier',
        image: require('../assets/images/justintime.png'),
    },
    {
        key: 'three',
        title: 'Bill payment made easy',
        text: 'Pay bill on the go without hassles',
        image: require('../assets/images/billseasy.png'),
    }
];


const OnboardingButton = styled.View`
width: 40px;
 height: 40px;
  background-color: ${theme.colors.zippaBlue};
   align-items: center;
    justify-content: center;
     border-radius: 40px;
`;

const GetStartedButton = styled(OnboardingButton)`
    width: 100%;
    padding: 2px 15px;
`