import { StyleSheet } from "react-native";
import { colors, fonts, metrics } from "../../styles";

const styles = (theme) => StyleSheet.create({
    buttonHeaderView: {
        marginBottom: metrics.baseMargin
    },
    scrollList: {
        borderWidth: 1,
        borderColor: 'red'
    },
    incomeView: {
        flexDirection: 'row',
        paddingBottom: metrics.basePadding,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightPrimary,
    },
    incomeText: {
        fontFamily: fonts.montserratBold,
        fontSize: fonts.medium,
        color: theme == 'light' ? colors.strongBlue : colors.lightBlue,
        marginLeft: metrics.baseMargin / 2
    },
    autoEntryView: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        marginBottom: metrics.baseMargin,
    },
    infoIcon: {
        marginLeft: metrics.baseMargin,
    },
    infoView: {
        padding: 5,
        position: 'absolute',
        right: 5,
        top: 45,
        width: 130,
        height: 40,
        backgroundColor: colors.infoBlack,
        borderRadius: metrics.smallRadius
    },
    infoText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: 10,
        color: colors.white,
        textAlign: 'center'
    },
    triangle: {
        position: 'absolute',
        width: 15,
        height: 15,
        top: -10,
        right: 20,
        borderTopWidth: 0,
        borderRightWidth: 7,
        borderBottomWidth: 13,
        borderLeftWidth: 7,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: colors.infoBlack,
        borderLeftColor: 'transparent', 
    }
});

export default styles;