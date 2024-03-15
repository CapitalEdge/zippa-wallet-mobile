import {useFonts as Fonts} from "expo-font";


const useFonts = () => {
    const [loaded, error] = Fonts({
        'zippa-light': require('../assets/fonts/Poppins-Light.ttf'),
        'zippa-regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'zippa-medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'zippa-semibold': require('../assets/fonts/Poppins-SemiBold.ttf'),
        'zippa-bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'zippa-extraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
        'zippa-black': require('../assets/fonts/Poppins-Black.ttf')
    });
    return {
        loaded,
        error
    }
}

export default useFonts;

