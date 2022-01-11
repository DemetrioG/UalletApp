import { StyleSheet } from "react-native";
import { fonts, colors, metrics } from "../../styles";

const styles = (theme, background) => StyleSheet.create({
    actionText: {
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.regular,
        color: theme == 'light' ? colors.darkPrimary : colors.white,
        marginBottom: metrics.baseMargin
    },
    sheetIndicator: {
        width: 30,
        height: 5,
        backgroundColor: colors.lightGray
    },
    sheetBackground: {
        backgroundColor: theme == 'light' ? colors.lightSecondary : colors.darkSecondary
    },
    sheetContainer: {
        marginHorizontal: metrics.baseMargin,
        padding: metrics.basePadding
    },
    sheetView: {
        marginTop: metrics.baseMargin,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    loginWithContainer: {
        padding: 8,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: metrics.baseRadius,
        backgroundColor: background
    }
})

export default styles;