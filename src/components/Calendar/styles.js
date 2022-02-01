import { StyleSheet } from "react-native";
import { colors, fonts, metrics } from "../../styles";

const styles = (theme) => StyleSheet.create({
    headerDate: {
        width: '100%',
        padding: metrics.basePadding,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: theme == 'light' ? colors.lightPrimary : colors.darkPrimary,
        borderBottomWidth: 1,
        borderColor: colors.lightGray,
        borderTopLeftRadius: metrics.baseRadius,
        borderTopRightRadius: metrics.baseRadius
    },
    dateText: {
        fontFamily: fonts.ralewayBold,
        fontSize: fonts.regular,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    }
});

export default styles;