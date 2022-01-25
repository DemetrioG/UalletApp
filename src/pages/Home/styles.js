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
    cardHeaderTextView: {
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
    income: {
        fontFamily: fonts.montserratBold,
        fontSize: fonts.larger,
        color: theme == 'light' ? colors.strongBlue : colors.lightBlue
    }
});

export default styles;