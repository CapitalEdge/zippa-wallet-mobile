import { Text } from '../Themed';
import { useRef } from 'react';
import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';


export default function Unavailable() {
    const animation = useRef(null)
  return (
      <LoanContainer>
          <Text fontFamily='zippa-semibold' fontSize={14}>Feature coming soon on Zippa Wallet</Text>
          <LottieView
              autoPlay
              ref={animation}
              style={{
                  width: 400,
                  height: 400,
              }}
              source={require('../../assets/vectors/loanLottie.json')}
          />
          <Text fontSize={40} style={{ textAlign: 'center' }}>
              Get instant access to loans
          </Text>
          <Text fontSize={16} style={{ textAlign: 'center' }}>
              Walk into any of our offices to get autheticated fast and easy
          </Text>
      </LoanContainer>
  )
}


const LoanContainer = styled.View`
    justify-content: center;
    align-items: center;
    padding: 0 5%;
`
