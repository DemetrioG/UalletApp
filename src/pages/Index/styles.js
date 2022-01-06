import { colors, fonts, metrics } from "../../styles";
import { StyleSheet } from "react-native";

const styles = (theme) => StyleSheet.create({
    imageCarousel: {
        resizeMode: 'contain',
        height: '80%',
        width: '100%',
    },
    titleCarousel: {
        fontSize: fonts.larger,
        fontFamily: fonts.ralewayExtraBold,
        textAlign: 'center',
        marginTop: metrics.doubleBaseMargin,
        color: theme == 'light' ? colors.darkPrimary : colors.lightPrimary
    },
    titleCarouselDark: {
        fontSize: fonts.larger,
        fontFamily: fonts.ralewayExtraBold,
        textAlign: 'center',
        marginTop: metrics.doubleBaseMargin,
        color: colors.white
    },
    carousel: {
        marginTop: metrics.doubleBaseMargin * 3,
    },
    buttonLogin: {
        marginBottom: metrics.doubleBaseMargin * 2
    }
});

export default styles;