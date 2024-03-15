import styled from 'styled-components/native'
import { TextProps } from '../helpers/types'
import { theme } from '../constants/Colors'

export const Text = styled.Text<TextProps>`
    color: ${(props: { color: string; }) => props.color || theme.colors.zippaBlack};
    font-size: ${(props: { fontSize: string; }) => props.fontSize || 16}px;
    font-family: ${(props: { fontFamily: string; }) => props.fontFamily || 'zippa-regular'};
`;


export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.zippaLight};
`;

export const ScreenContent = styled.View`
  display: flex;
  padding: 0 5%;
`;

export const ScrollScreen = styled.ScrollView`
  width: 100%;
  height: 100%; 
  background-color: ${theme.colors.zippaLight};
`;

export const EditShowContainer = styled.Pressable`
  position: absolute;
  right: 20px;
  top: 25px;
  background-color: ${theme.colors.zippaLight};
  border-radius: 10px;
  padding: 10px;
`;

export const SheetContainer = styled.View`
    heigh: 100%;
    max-height: 650px;
    padding: 20px 20px 10px 20px;
    background-color: ${theme.colors.zippaLight}
`;

export const Savings = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 25px;
  width: 100%;
  height: 100px;
  background-color: ${theme.colors.zippaWhite};
  border-radius: 5px;
  margin-bottom: 25px;
  `;

export const SavingsDataCard = styled.View<{ backgroundColor: string, border?: string}>`
    display: flex;
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
    background-color: ${(props: { backgroundColor: string; }) => props.backgroundColor};
    border-bottom-width: 2px;
    border-bottom-color: ${(props: { border: string; }) => props.border};
`;

export const InputBox = styled.View`
  margin: 20px 0 5px 0;
  background-color: ${theme.colors.zippaWhite};
  border-radius: 10px; 
  padding: 10px;
`;

export const Input = styled.TextInput`
  width: 100%;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.zippaGrey};
  padding: 5px 5px;
  font-size: 14px;
  font-family: 'zippa-regular';
  `;

export { theme };
  
export const NairaSign = () => '₦';

export const RightNairaSign = () => {
  return (
    <Text style={{ position: 'absolute', right: 5, top: 5 }} color={theme.colors.zippaGrey} fontFamily="zippa-medium" fontSize={14}>{NairaSign()}</Text>
  )
};