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
 * https://www.ocpsoft.org/tutorials/regular-expressions/password-regular-expression/
  ^                                            Match the beginning of the string
  (?=.*[0-9])                                  Require that at least one digit appear anywhere in the string
  (?=.*[a-z])                                  Require that at least one lowercase letter appear anywhere in the string
  (?=.*[A-Z])                                  Require that at least one uppercase letter appear anywhere in the string
  (?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\])        Require that at least one special character appear anywhere in the string
  .{8,32}                                      The password must be at least 8 characters long, but no more than 32
  $                                            Match the end of the string.
 */
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
