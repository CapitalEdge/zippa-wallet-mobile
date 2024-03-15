import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { SheetContainer, theme } from "../../components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable } from "react-native"
import { SheetManager } from 'react-native-actions-sheet'

export default function SheetWrapper({ props, children, sheetName, gestureEnabled = true, headerAlwaysVisible = true, hideCloseButton = false, closeOnTouchBackdrop = false, ExtraOverlayComponent }: { props?: SheetProps, children: JSX.Element, sheetName: string, gestureEnabled?: boolean, headerAlwaysVisible?: boolean, hideCloseButton?: boolean, closeOnTouchBackdrop?: boolean, ExtraOverlayComponent?: React.ReactNode }) {
    return (
        <ActionSheet id={props?.sheetId} zIndex={5} ExtraOverlayComponent={ExtraOverlayComponent} headerAlwaysVisible={headerAlwaysVisible} elevation={0} closeOnTouchBackdrop={closeOnTouchBackdrop} enableGesturesInScrollView={false} gestureEnabled={gestureEnabled} indicatorStyle={{
            width: 70,
            marginVertical: 10,
            backgroundColor: theme.colors.zippaGrey
        }
        } containerStyle={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: theme.colors.zippaLight
            }}>
            <Pressable style={{ position: "absolute", right: 20, top: 20, zIndex: 20, display: hideCloseButton ? 'none' : 'flex' }} onPress={() => SheetManager.hide(sheetName)}>
                <FontAwesome name="times" size={22} color={theme.colors.zippaGrey} />
            </Pressable>
            <SheetContainer>
                {children}
            </SheetContainer>
        </ActionSheet>
    )
}