import * as React from "react";
import styled from "styled-components";
import { Control, FieldValues } from "react-hook-form";

import TextInput from "../TextInput";
import { colors, metrics } from "../../styles";
import { Icon as DefaultIcon } from "../../styles/general";

const Icon = styled(DefaultIcon)`
  margin-right: ${metrics.baseMargin}px;
  color: ${colors.gray};
`;

const TextInputPassword = (
  props: React.ComponentProps<typeof TextInput> & {
    name: string;
    control: Control<FieldValues | any>;
  }
) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <TextInput
      {...props}
      textContentType="oneTimeCode"
      secureTextEntry={!visible}
      InputRightElement={
        <Icon
          name={!visible ? "eye" : "eye-off"}
          size={18}
          onPress={() => setVisible(!visible)}
        />
      }
    />
  );
};

export default TextInputPassword;
