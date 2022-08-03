import * as React from "react";
import { IInputProps, Input, WarningOutlineIcon } from "native-base";
import { TextInputMask } from "react-native-masked-text";
import { Control, Controller, FieldValues } from "react-hook-form";
import { FormControl as NativeFormControl } from "native-base";

import { colors, metrics } from "../../styles";
import NativeIcon from "../Icon";
import styled from "styled-components";

const Icon = styled(NativeIcon)`
  position: absolute;
  top: -38px;
  right: 8px;
  padding: 8px;
`;

const FormControl = styled(NativeFormControl)`
  margin-bottom: ${metrics.baseMargin}px;
`;

const CalendarIcon = ({
  setCalendar,
}: {
  setCalendar: React.Dispatch<React.SetStateAction<any>>;
}) => {
  return (
    <Icon
      name="calendar"
      size={18}
      color={colors.gray}
      onPress={() => setCalendar((calendarState: boolean) => !calendarState)}
    />
  );
};

const UTextInput = (
  props: IInputProps & {
    masked?: "datetime" | "money";
    errors?: object | undefined;
    helperText?: string | undefined;
    withIcon?: boolean;
    setCalendar?: React.Dispatch<React.SetStateAction<boolean>>;
  }
) => {
  const [isInvalid, setIsInvalid] = React.useState(false);

  React.useEffect(() => {
    if (props.errors && Object.keys(props.errors).length > 0) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [props.errors]);

  return (
    <>
      <FormControl isInvalid={isInvalid}>
        <>
          {props.masked ? (
            <TextInputMask
              {...props}
              customTextInput={Input}
              type={props.masked}
            />
          ) : (
            <Input {...props} />
          )}
          {props.masked === "datetime" && props.withIcon && (
            <CalendarIcon setCalendar={props.setCalendar!} />
          )}
        </>
        {props.helperText && (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {props.helperText}
          </FormControl.ErrorMessage>
        )}
      </FormControl>
    </>
  );
};

const StyledTextInput = styled(UTextInput)`
  color: ${({ theme: { theme } }) => theme.text};
`;

const TextInput = ({
  name,
  control,
  ...props
}: React.ComponentProps<typeof UTextInput> & {
  masked?: "datetime" | "money";
  name: string;
  control: any;
  setCalendar?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <StyledTextInput
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
