import { Flex, Progress, Text, VStack } from "native-base";
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
const PasswordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");

function checkPassword(passwordText: string) : number {
    const minimumEntryRequirement =  PasswordRegex.test(passwordText);
    console.log(minimumEntryRequirement)
    if (!minimumEntryRequirement) return 30;
    if (passwordText.length < 10) return 70;
    return 100;
}

function PasswordRules({ content }: { content: string }) {
    const [passwordStrength, setPasswordStrenght] = React.useState(0);

    React.useEffect(() => {
        if (!content) return setPasswordStrenght(0);
        console.log(content);
        const strengthPasswordPercentage = checkPassword(content);
        console.log(strengthPasswordPercentage);
        return setPasswordStrenght(strengthPasswordPercentage);
    }, [content]);

    return (
        <VStack space={1}>
          <Progress value={passwordStrength} size="lg" />
            <Text fontSize="lg">Sua senha deve conter pelo menos:</Text>
            {dataRules.map((rule, index) => (
                <Flex key={index} direction="row" alignItems="center">
                    <Text style={{ fontSize: 5 }}>
                        {"\u2B24 "}
                        {"  "}
                    </Text>
                    <Text fontSize="md">{rule}</Text>
                </Flex>
            ))}
        </VStack>
    );
}

export default PasswordRules;
