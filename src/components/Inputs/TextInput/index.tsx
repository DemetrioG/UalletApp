import { useState, useEffect } from "react";
import { Input, Pressable, WarningOutlineIcon } from "native-base";
import { TextInputMask, TextInputMaskTypeProp } from "react-native-masked-text";
import { Controller } from "react-hook-form";
import { FormControl } from "native-base";

import { useTheme } from "styled-components";
import When from "../../When";
import { CalendarSearch } from "lucide-react-native";
import { IThemeProvider } from "../../../styles/baseTheme";
import { FormTextInputProps, TextInputProps } from "./types";

const TextInput = (props: TextInputProps) => {
  const { theme }: IThemeProvider = useTheme();
  const [isInvalid, setIsInvalid] = useState(false);
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

  useEffect(() => {
    const hasError = !!Object.keys(errors ?? {}).length;
    setIsInvalid(hasError);
  }, [errors]);

  return (
    <FormControl mb={15} isInvalid={isInvalid}>
      <When is={!!masked}>
        <TextInputMask
          {...restProps}
          customTextInput={Input}
          type={masked as TextInputMaskTypeProp}
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
        <Pressable onPress={setCalendar} position="absolute" right={4} top={3}>
          <CalendarSearch color={theme?.text} opacity={0.6} />
        </Pressable>
      </When>
      <When is={!!helperText}>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {helperText}
        </FormControl.ErrorMessage>
      </When>
    </FormControl>
  );
};

export const FormTextInput = ({
  name,
  control,
  ...props
}: FormTextInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          {...props}
        />
      )}
    />
  );
};
