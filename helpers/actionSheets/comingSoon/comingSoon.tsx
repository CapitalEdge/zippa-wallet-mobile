import { NairaSign, Text, theme } from "../../../components/Themed";
import SheetWrapper from "../sheetWrapper";
import { ScrollView, View } from "react-native";
import ZippaButton from "../../../components/Button";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { ThousandSeparator } from "../../thousandSeparator";
import { router } from "expo-router";
import { InterSwitch } from "../../../utilities/isw";
import { useGlobalStore } from "../../../stores/store";
import Spinner from "../../../components/Spinner";
import { useUserStore } from "../../../stores/feature/users";

export default function ComingSoon() {

    const userData = useUserStore(state => state.userData);

    return (
        <SheetWrapper sheetName="coming-soon" gestureEnabled={true} hideCloseButton={true} closeOnTouchBackdrop={true}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ marginVertical: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                   
                    <Text fontFamily="zippa-bold">Coming soon</Text>
                    <Text>Sorry, check back again.</Text>
                </View>

                {/* <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                    <ZippaButton color={theme.colors.zippaBlue} text="Okay" action={() => {
                        SheetManager.hide('coming-soon');
                    }} />
                </View> */}
            </ScrollView>
        </SheetWrapper>
    );
}
