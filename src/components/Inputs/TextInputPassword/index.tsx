import { useState } from "react";
import { useTheme } from "styled-components";

import { FormTextInput } from "../TextInput";
import When from "../../When";
import { Eye, EyeOff } from "lucide-react-native";
import { Pressable } from "native-base";
import { IThemeProvider } from "../../../styles/baseTheme";
import { FormTextInputProps } from "../TextInput/types";

export const FormTextInputPassword = (props: FormTextInputProps) => {
  const { theme }: IThemeProvider = useTheme();
  const [visible, setVisible] = useState(false);
  return (
    <FormTextInput
      {...props}
      textContentType="none"
      secureTextEntry={!visible}
      InputRightElement={
        <Pressable onPress={() => setVisible(!visible)} mr={3}>
          <When is={!visible}>
            <Eye color={theme?.text} />
          </When>
          <When is={visible}>
            <EyeOff color={theme?.text} />
          </When>
        </Pressable>
      }
    />
  );
};
