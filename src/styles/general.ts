import { Platform } from "react-native";
import { colors } from ".";
import metrics from "./metrics";

const general = {
    card: {
        padding: metrics.basePadding,
    },
    containerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCenter: {
        textAlign: 'center',
    },
    flex: {
        flex: 1,
    },
    input: {
        width: 250,
        height: 45,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.strongBlue,
        borderRadius: metrics.mediumRadius,
        marginBottom: metrics.smallMargin,
        width: 250,
        height: 45,
    },
    buttonOutline: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.strongBlue,
        borderRadius: metrics.mediumRadius,
        marginBottom: metrics.smallMargin,
        width: 250,
        height: 45,
    },
    buttonText: {
        color: colors.white,
    },
    buttonOutlineText: {
        color: colors.strongBlue,
    },
    statusBar: {
        marginTop: Platform.OS === 'android' ? 25 : 0,
    },
    backgroundColor: {
        backgroundColor: colors.lightPrimary,
    }
};

export default general;