import { Flex, VStack } from "native-base";
import { ProgressBar, Text } from "./style";
import * as React from "react";

const dataRules = [
    "Uma letra maiúscula",
    "Uma letra minúscula",
    "Um caracter especial",
    "Um número",
    "Oito caracteres",
];

/**
 * https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    This regex will enforce these rules:

    At least one upper case English letter, (?=.*?[A-Z])
    At least one lower case English letter, (?=.*?[a-z])
    At least one digit, (?=.*?[0-9])
    At least one special character, (?=.*?[#?!@$%^&*-])
    Minimum eight in length .{8,} (with the anchors)
 */
const PasswordRegex = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);

function checkPassword(passwordText: string): number {
    const hasMinimumEntryRequirement = PasswordRegex.test(passwordText);
    if (!hasMinimumEntryRequirement) return 30;
    if (passwordText.length < 10) return 70;
    return 100;
}

const PasswordStrengthLabel: { [key: number]: string } = {
    30: "Fraca",
    70: "Média",
    100: "Forte",
};

function PasswordRules({
    content = "",
    ...props
}: { content: string } & React.ComponentProps<typeof VStack>) {
    const [passwordStrength, setPasswordStrenght] = React.useState(0);
    const hasLength = content.length;

    React.useEffect(() => {
        if (!content) return setPasswordStrenght(0);
        const strengthPasswordPercentage = checkPassword(content);
        return setPasswordStrenght(strengthPasswordPercentage);
    }, [content]);

    return (
        <VStack space={1} {...props}>
            <Text fontSize={16} fontWeight="bold">
                {(passwordStrength &&
                    PasswordStrengthLabel[passwordStrength]) ||
                    ""}
            </Text>
            {!!hasLength && (
                <ProgressBar
                    value={passwordStrength}
                    strength={passwordStrength}
                    size="md"
                />
            )}
            <Text fontSize="md">Sua senha deve conter pelo menos:</Text>
            {dataRules.map((rule, index) => (
                <Flex key={index} direction="row" alignItems="center">
                    <Text style={{ fontSize: 5 }}>
                        {"\u2B24 "}
                        {"  "}
                    </Text>
                    <Text>{rule}</Text>
                </Flex>
            ))}
        </VStack>
    );
}

export default PasswordRules;
