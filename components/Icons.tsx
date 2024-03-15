import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export function TabBarIcon({ size, IconName, name, color }: { size: number, IconName: typeof MaterialCommunityIcons | typeof MaterialIcons | typeof FontAwesome5, name: React.ComponentProps<typeof IconName>['name'], color: string }) {
    return <IconName size={size} style={{ marginBottom: -3 }} name={name} color={color} />;
}