import { StyleSheet } from "react-native";
import { colors, fonts, metrics } from "../../styles";

const styles = (theme) => StyleSheet.create({
    modalView: {
        paddingHorizontal: metrics.basePadding,
        paddingVertical: metrics.topBottomPadding,
        alignItems: 'center',
        width: 294,
        backgroundColor: theme == 'light' ? colors.lightPrimary : colors. darkPrimary,
        borderRadius: metrics.baseRadius
    },
    backgroundModal: {
        backgroundColor: theme == 'light' ? colors.transpLight : colors.transpDark
    },
    iconModal: {
        width: 150
    },
    textModal: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.large,
        marginBottom: metrics.doubleBaseMargin,
        textAlign: 'center',
        color: theme == 'light' ? colors.darkPrimary : colors.white
    }
});

export default styles;