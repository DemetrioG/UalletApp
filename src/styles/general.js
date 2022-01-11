import { Platform, StyleSheet } from "react-native";
import colors from "./colors"
import metrics from "./metrics";
import fonts from "./fonts";

const general = (theme, margin) => StyleSheet.create({
    card: {
        padding: metrics.basePadding,
    },
    padding: {
        paddingHorizontal: metrics.basePadding,
        paddingTop: metrics.topBottomPadding,
    },
    containerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCenter: {
        textAlign: 'center',
    },
    flex: {
        flex: 1,
    },
    input: {
        width: 250,
        height: 45,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: metrics.mediumRadius,
        borderWidth: 2,
        borderColor: colors.lightGray,
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.regular,
        marginBottom: metrics.baseMargin,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.strongBlue,
        borderRadius: metrics.mediumRadius,
        marginBottom: margin,
        width: 250,
        height: 45,
    },
    buttonOutline: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme == 'light' ? colors.strongBlue : colors.lightBlue,
        borderRadius: metrics.mediumRadius,
        marginBottom: margin,
        width: 250,
        height: 45,
    },
    buttonText: {
        color: colors.white,
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.regular,
    },
    buttonOutlineText: {
        color: theme == 'light' ? colors.strongBlue : colors.lightBlue,
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.regular,
    },
    statusBar: {
        marginTop: Platform.OS === 'android' ? 25 : 0,
    },
    backgroundColor: {
        backgroundColor: theme == 'light' ? colors.lightPrimary : colors.darkPrimary,
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingHorizontal: metrics.basePadding
    },
    logo: {
        width: 48,
        height: 58
    },
    textUalletHeader: {
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.big,
        color: theme == 'light' ? colors.darkPrimary : colors.white,
        marginLeft: metrics.baseMargin,
    },
    containerHeaderTitle: {
        marginTop: metrics.doubleBaseMargin,
        paddingHorizontal: metrics.basePadding
    },
    headerTitle: {
        fontFamily: fonts.ralewayBold,
        fontSize: fonts.medium,
        color: theme == 'light' ? colors.darkPrimary : colors.white,
    },
});

export default general;