import * as React from "react";
import styled from "styled-components";
import { Control, Controller, FieldValues } from "react-hook-form";

import {
  FormControl as NativeFormControl,
  IInputProps,
  Input,
  WarningOutlineIcon,
} from "native-base";
import { metrics } from "../../styles";
import { TextInputMask } from "react-native-masked-text";

const FormControl = styled(NativeFormControl)`
  margin-bottom: ${metrics.baseMargin}px;
`;

const UTextInput = (
  props: IInputProps & {
    datetime?: boolean;
    errors?: object | undefined;
    helperText?: string | undefined;
  }
) => {
  const [isInvalid, setIsInvalid] = React.useState(false);

  React.useEffect(() => {
    if (props.errors && Object.keys(props.errors).length > 0) {
      setIsInvalid(true);
    }
  }, [props.errors]);

  return (
    <>
      <FormControl isInvalid={isInvalid}>
        <>
          {props.datetime ? (
            <TextInputMask {...props} customTextInput={Input} type="datetime" />
          ) : (
            <Input {...props} />
          )}
        </>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {props.helperText}
        </FormControl.ErrorMessage>
      </FormControl>
    </>
  );
};

const StyledTextInput = styled(UTextInput)`
  color: ${({ theme: { theme } }) => theme.text};
`;

const TextInput = ({
  datetime,
  name,
  control,
  ...props
}: React.ComponentProps<typeof UTextInput> & {
  datetime?: boolean;
  name: string;
  control: Control<FieldValues | any>;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <StyledTextInput
          datetime={datetime}
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          {...props}
        />
      )}
    />
  );
};

export default TextInput;
