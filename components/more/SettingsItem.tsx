import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { Text, theme } from '../Themed';

export default function SettingsItem({ icon, text, onPress }: { icon: string, text: string, onPress?: () => void }) {
  return (
      <Item onPress={onPress}>
        <FontAwesome5 name={icon} color={theme.colors.zippaSubtle} size={16} style={{ padding: 5, backgroundColor: theme.colors.zippaBlue, borderRadius: 5, width: 28, height: 28, textAlign: 'center' }} />
        <Text fontSize={14} fontFamily='zippa-semibold'>{text}</Text>
        <Ionicons name="chevron-forward" size={24} color={theme.colors.zippaBlue} />
      </Item>
  )
}


const Item = styled.Pressable`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${theme.colors.zippaGrey};
  background-color: ${theme.colors.zippaWhite};
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: ${theme.colors.zippaSubtle};
`;