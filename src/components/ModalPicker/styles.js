import { StyleSheet } from "react-native";
import { color } from "react-native-reanimated";
import { colors, fonts, metrics } from "../../styles";

const styles = (theme) => StyleSheet.create({
    alignVertical: {
        justifyContent: 'center'
    },
    modal: {
        backgroundColor: '#FFF',
        borderRadius: 10
    },
    backgroundModal: {
        backgroundColor: theme == 'light' ? colors.transpLight : colors.transpDark
    },
    modalView: {
        paddingHorizontal: metrics.basePadding,
        paddingVertical: metrics.topBottomPadding,
        width: 294,
        height: 350,
        backgroundColor: theme == 'light' ? colors.lightPrimary : colors. darkPrimary,
        borderRadius: metrics.baseRadius
    },
    itemPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: metrics.basePadding,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        marginBottom: metrics.baseMargin
    },
    textItem: {
        fontFamily: fonts.ralewayBold,
        fontSize: fonts.regular,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    },
    title: {
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.large,
        color: theme == 'light' ? colors.strongBlue : colors.lightBlue,
        marginLeft: metrics.baseMargin,
        marginBottom: metrics.baseMargin
    }
});

export default styles;