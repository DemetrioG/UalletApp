import { Flex, Progress, Text, VStack } from "native-base";
import * as React from "react";

const dataRules = [
    "Uma letra maiúscula",
    "Uma letra minúscula",
    "Um caracter especial",
    "Um número",
    "Oito caracteres",
];

const Regex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]).{8,32}$");

function checkPassword(passwordText: string) : number {
    const minimumEntryRequirement =  Regex.test(passwordText);
    if (!minimumEntryRequirement) return 30;
    if (passwordText.length < 10) return 70;
    return 100;
}

function PasswordRules({ content }: { content: string }) {
    const [passwordStrength, setPasswordStrenght] = React.useState(0);

    React.useEffect(() => {
        if (!content) return setPasswordStrenght(0);
        const strengthPasswordPercentage = checkPassword(content);
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
