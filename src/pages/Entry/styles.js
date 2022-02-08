import { StyleSheet } from "react-native";
import { colors, fonts, metrics } from "../../styles";

const styles = (theme, type) => StyleSheet.create({
    buttonHeaderView: {
        marginBottom: metrics.baseMargin
    },
    itemView: {
        flexDirection: 'row',
    },
    descriptionView: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: colors.lightPrimary,
        padding: metrics. basePadding / 2
    },
    descriptionText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.regular,
        color: colors.gray
    },
    valueView: {
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: metrics.basePadding / 2
    },
    valueText: {
        fontFamily: fonts.montserratMedium,
        fontSize: fonts.regular,
        color: theme == 'light' ? (type == 'Receita' ? colors.strongGreen : colors.strongRed) : (type == 'Receita' ? colors.lightGreen : colors.lightRed)
    },
    moreView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingView: {
        position: 'absolute',
        top: 40,
        padding: metrics.basePadding / 1.5,
        borderRadius: metrics.mediumRadius,
        backgroundColor: colors.strongBlue
    },
    loadingText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.medium,
        color: colors.white
    },
    iconEmpty: {
        width: 230
    },
    iconLoading: {
        width: 50
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