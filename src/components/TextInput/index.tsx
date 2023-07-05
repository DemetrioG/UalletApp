import * as React from "react";
import { IInputProps, Input, WarningOutlineIcon } from "native-base";
import {
  TextInputMask,
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from "react-native-masked-text";
import { Controller } from "react-hook-form";
import { FormControl as NativeFormControl } from "native-base";

import { metrics } from "../../styles";
import NativeIcon from "../Icon";
import styled from "styled-components";
import When from "../When";

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
      onPress={() => setCalendar((calendarState: boolean) => !calendarState)}
    />
  );
};

const UTextInput = (
  props: IInputProps & {
    masked?: TextInputMaskTypeProp;
    errors?: object | undefined;
    helperText?: string | undefined;
    withIcon?: boolean;
    options?: TextInputMaskOptionProp;
    setCalendar?: React.Dispatch<React.SetStateAction<boolean>>;
    customTextInputProps?: object;
  }
) => {
  const [isInvalid, setIsInvalid] = React.useState(false);
  const {
    masked,
    withIcon,
    helperText,
    errors,
    setCalendar,
    isRequired,
    placeholder,
    ...restProps
  } = props;

  React.useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [errors]);

  return (
    <>
      <FormControl isInvalid={isInvalid}>
        <>
          <When is={!!masked}>
            <TextInputMask
              {...restProps}
              customTextInput={Input}
              type={masked}
              placeholder={isRequired ? `${placeholder} *` : placeholder}
            />
          </When>
          <When is={!masked}>
            <Input
              {...restProps}
              placeholder={isRequired ? `${placeholder} *` : placeholder}
            />
          </When>
          <When is={masked === "datetime" && !!withIcon}>
            <CalendarIcon setCalendar={setCalendar!} />
          </When>
        </>
        {helperText && (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {helperText}
          </FormControl.ErrorMessage>
        )}
      </FormControl>
    </>
  );
};

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
        <UTextInput
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
