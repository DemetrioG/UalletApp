import { useState, useEffect } from "react";
import { TextArea as NativeTextArea, WarningOutlineIcon } from "native-base";
import { Controller } from "react-hook-form";
import { FormControl } from "native-base";

import When from "../../When";
import { FormTextAreaProps, TextAreaProps } from "./types";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../styles/baseTheme";

const TextArea = (props: TextAreaProps) => {
  const { theme }: IThemeProvider = useTheme();
  const [isInvalid, setIsInvalid] = useState(false);
  const { helperText, errors, isRequired, placeholder, ...restProps } = props;

  useEffect(() => {
    const hasError = !!Object.keys(errors ?? {}).length;
    setIsInvalid(hasError);
  }, [errors]);

  return (
    <FormControl mb={15} isInvalid={isInvalid}>
      <NativeTextArea
        isInvalid={isInvalid}
        borderWidth={isInvalid ? 1 : 0}
        fontSize={14}
        h={40}
        placeholderTextColor={theme?.text}
        autoCompleteType
        {...restProps}
        placeholder={isRequired ? `${placeholder} *` : placeholder}
      />
      <When is={!!helperText}>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {helperText}
        </FormControl.ErrorMessage>
      </When>
    </FormControl>
  );
};

export const FormTextArea = ({
  name,
  control,
  ...props
}: FormTextAreaProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextArea
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          {...props}
        />
      )}
    />
  );
};
