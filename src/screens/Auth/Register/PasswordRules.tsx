import * as React from "react";
import { HStack, Text, VStack } from "native-base";
import { ProgressBar } from "./styles";
import { Info } from "lucide-react-native";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../styles/baseTheme";
import Tooltip from "../../../components/Tooltip";

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

export function PasswordRules({
  content = "",
  primary,
  ...props
}: { content: string; primary?: boolean } & React.ComponentProps<
  typeof VStack
>) {
  const { theme }: IThemeProvider = useTheme();
  const [passwordStrength, setPasswordStrenght] = React.useState(0);
  const hasLength = content.length;

  React.useEffect(() => {
    if (!content) return setPasswordStrenght(0);
    const strengthPasswordPercentage = checkPassword(content);
    return setPasswordStrenght(strengthPasswordPercentage);
  }, [content]);

  return (
    <VStack space={1} {...props}>
      {!!hasLength && (
        <>
          <Tooltip
            label={
              "Sua senha deve conter pelo menos:\n  Uma letra maiúscula\n  Uma letra minúscula\n  Um caracter especial\n  Um número\n  Oito caracteres"
            }
          >
            <HStack space={2} mb={1} mt={2}>
              <Info color={theme?.text} />
              <Text fontSize="16" fontWeight="600">
                {passwordStrength && PasswordStrengthLabel[passwordStrength]}
              </Text>
            </HStack>
          </Tooltip>
          <ProgressBar primary={primary} value={passwordStrength} size="md" />
        </>
      )}
    </VStack>
  );
}
