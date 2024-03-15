import styled from 'styled-components/native';
import { theme, Text } from './Themed';
import { View } from 'react-native';

export default function ZippaButton({ color, text, action, textColor, disabled }: {
    color?: string;
    text: string;
    action?: () => void;
  textColor?: string;
  disabled?: boolean;
}) {
  return (
      <View style={{borderRadius: 10, overflow: 'hidden', marginTop: 20}}>
      <Button disabled={disabled} color={disabled ? theme.colors.zippaDisabled : color} onPress={action} android_ripple={{ color: theme.colors.zippaGrey }}>
              <Text color={textColor || theme.colors.zippaLight}>{text}</Text>
          </Button>
      </View>
  )
}

const Button = styled.Pressable<{ justify: string, color: string }>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props: { justify: string; }) => props.justify || "center"};
  align-items: center;
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  margin-top: 0px;
  background-color: ${(props: { color: string }) => props.color || theme.colors.zippaBlue};
  align-items: center;
`;


