import { StyleSheet } from "react-native";
import { colors, fonts, metrics } from "../../styles";

const styles = StyleSheet.create({
    imageCarousel: {
        resizeMode: 'contain',
        height: '60%',
        width: '100%',
    },
    titleCarousel: {
        fontSize: fonts.larger,
        fontFamily: fonts.ralewayExtraBold,
        textAlign: 'center',
        marginTop: metrics.doubleBaseMargin,
    },
    carousel: {
        marginTop: metrics.baseMargin,
    }
});

export default styles;