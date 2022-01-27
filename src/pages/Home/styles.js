import { StyleSheet } from "react-native";
import { colors, fonts, metrics } from "../../styles";

const styles = (theme) => StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: metrics.baseMargin,
        paddingLeft: metrics.basePadding
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
    cardTextView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardHeaderText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.large,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    },
    cardHeaderView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: metrics.baseMargin / 2
    },
    logoCard: {
        width: 20,
        height: 25
    },
    balance: {
        fontFamily: fonts.montserratBold,
        fontSize: fonts.larger,
        color: theme == 'light' ? colors.strongBlue : colors.lightBlue
    },
    cardStatusView: {
        marginBottom: metrics.baseMargin
    },
    statusBoldText: {
        fontFamily: fonts.ralewayBold,
        fontSize: fonts.medium,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    },
    statusText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.medium,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    },
    invest: {
        fontFamily: fonts.montserratBold,
        fontSize: fonts.larger,
        color: theme == 'light' ? colors.strongPurple : colors.yellow,
        marginBottom: metrics.baseMargin
    },
    cardFooterText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.regular,
        color: theme == 'light' ? colors.darkPrimary : colors.white,
        marginRight: metrics.baseMargin / 2
    },
    incomeChartView: {
        padding: metrics.basePadding + 3,
        backgroundColor: theme == 'light' ? colors.lightPrimary : colors.darkPrimary,
        borderRadius: metrics.baseRadius,
        width: '45%'
    },
    incomeChartLabelView: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme == 'light' ? colors.lightPrimary : colors.darkPrimary,
    },
    incomeChartLabelText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.regular,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    },
    incomeView: {
        flex: 1,
        paddingVertical: metrics.basePadding * 1.5,
        marginLeft: metrics.baseMargin,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    incomeText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.regular,
        color: theme == 'light' ? colors.darkPrimary : colors.white,
        marginRight: metrics.baseMargin / 2
    },
    segmentChartView: {
        width: '50%'
    },
    labelPieChart: {
        fontFamily: fonts.montserratMedium,
        fontSize: fonts.medium,
        color: colors.white,
    },
    segmentLabelView: {
        width: '50%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    dotView: {
        width: 10,
        height: 10,
        borderRadius: 100,
        marginTop: 2,
        marginRight: metrics.baseMargin / 2
    },
    segmentLabelText: {
        fontFamily: fonts.ralewayMedium,
        fontSize: fonts.regular,
        color: theme == 'light' ? colors.darkPrimary : colors.white
    },
    contentLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        marginLeft: metrics.baseMargin
    }
});

export default styles;