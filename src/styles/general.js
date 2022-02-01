import { Platform, StyleSheet } from "react-native";
import colors from "./colors"
import metrics from "./metrics";
import fonts from "./fonts";

const general = (theme, margin) => StyleSheet.create({
    card: {
        padding: metrics.basePadding + 5,
        backgroundColor: theme == 'light' ? colors.lightSecondary : colors.darkSecondary,
        borderRadius: metrics.baseRadius,
        marginBottom: metrics.baseMargin
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
    inputDate: {
        width: 140,
        height: 30,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: metrics.smallRadius,
        borderWidth: 2,
        borderColor: colors.lightGray,
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.regular,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    },
    inputNumber: {
        width: 250,
        height: 45,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: metrics.mediumRadius,
        borderWidth: 2,
        borderColor: colors.lightGray,
        fontFamily: fonts.montserratExtraBold,
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
    buttonSmall: {
        width: 80,
        height: 30,
        borderRadius: metrics.smallRadius
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
    textHeader: {
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.largest,
        color: theme == 'light' ? colors.darkPrimary : colors.white,
        marginTop: metrics.baseMargin
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
    scrollViewCenter: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollViewTab: {
        marginBottom: metrics.doubleBaseMargin * 2.5,
        borderBottomLeftRadius: metrics.baseRadius,
        borderBottomRightRadius: metrics.baseRadius
    },
    viewTab: {
        flex: 1,
        padding: metrics.basePadding * 1.5,
        paddingBottom: 0,
        marginBottom: metrics.doubleBaseMargin * 2.5,
        borderRadius: metrics.baseRadius,
        backgroundColor: theme == 'light' ? colors.lightSecondary : colors.darkSecondary,
        minHeight: 500
    },
    viewTabContent: {
        flex: 1,
        paddingBottom: metrics.basePadding * 1.5,
        backgroundColor: theme == 'light' ? colors.lightSecondary : colors.darkSecondary,
    },
    textHeaderScreen: {
        fontFamily: fonts.ralewayBold,
        fontSize: fonts.large,
        color: theme == 'light' ? colors.darkPrimary : colors.white,
        marginBottom: metrics.baseMargin,
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    spaceAround: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    label: {
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.regular,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    }
});

export default general;