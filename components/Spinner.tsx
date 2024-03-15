import { View, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import { theme } from '../constants/Colors'
import styled from 'styled-components/native'
import * as Animatable from 'react-native-animatable';

export default function Spinner() {
  const breath = {
    0: {
      opacity: 1,
      scale: 0.7,
    },
    0.5: {
      opacity: 1,
      scale: 1,
    },
    1: {
      opacity: 1,
      scale: .7,
    },
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 999999, top: 0, left: 0, right: 0 , bottom: 0, backgroundColor: 'rgba(32,38,84,0.4)' }}>
      <ActivityIndicator size={60} color={theme.colors.zippaGreen} />
      <View style={{ backgroundColor: theme.colors.zippaBlue, padding: 10, borderRadius: 50, position: 'absolute' }}>
        <Animatable.View
          //animation={breath}
          easing="ease-out"
          iterationCount="infinite"
        >
          <IMAGE source={require('../assets/images/zippa-icon.png')} />
        </Animatable.View>
      </View>
    </View>
  )
}

const IMAGE = styled.Image`
  width: 25px;
  height: 25px;
`