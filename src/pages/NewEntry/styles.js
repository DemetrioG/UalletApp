import { StyleSheet } from "react-native";
import { colors, fonts, metrics } from "../../styles";

const styles = (theme, type) => StyleSheet.create({
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: metrics.baseMargin
    },
    typeView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 35
    },
    typeText: {
        fontFamily: fonts.ralewayExtraBold,
        fontSize: fonts.largeEmphasis,
        color: theme == 'light' ? (type == 'Receita' ? colors.strongGreen : colors.strongRed) : (type == 'Receita' ? colors.lightGreen : colors.lightRed) 
    },
    changeType: {
        marginTop: 5,
        marginLeft: metrics.baseMargin
    }
});

export default styles;