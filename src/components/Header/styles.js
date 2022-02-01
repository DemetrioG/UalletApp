import { StyleSheet } from "react-native";
import { colors, fonts, metrics } from "../../styles";

const styles = (theme) => StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: metrics.baseMargin,
        paddingLeft: metrics.basePadding,
    },
    headerText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.medium,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    },
    headerIconView: {
        flexDirection: 'row'
    },
    spaceIcon: {
        marginLeft: metrics.baseMargin
    },
    smallIconPadding: {
        paddingHorizontal: 10
    },
    menuView: {
        padding: metrics.basePadding,
        position: 'absolute',
        right: -5,
        top: 40,
        backgroundColor: colors.infoBlack,
        borderRadius: metrics.baseRadius,
        width: 200,
        zIndex: 5,
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: metrics.basePadding,
        paddingHorizontal: metrics.basePadding - 5,
        borderBottomWidth: 1,
        borderColor: colors.gray
    },
    itemText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.medium,
        color: colors.white
    },
    logoutText: {
        fontFamily: fonts.ralewayBold,
        fontSize: fonts.regular,
        color: colors.lightRed,
        marginRight: metrics.baseMargin
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default styles;