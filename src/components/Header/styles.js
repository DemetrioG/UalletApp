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
    }
});

export default styles;