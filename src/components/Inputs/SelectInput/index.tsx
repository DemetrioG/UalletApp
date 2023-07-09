import {
  CheckIcon,
  FormControl,
  Select,
  WarningOutlineIcon,
} from "native-base";
import { FormSelectInputProps, SelectInputProps } from "./types";
import { useEffect, useState } from "react";
import { IThemeProvider } from "../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { Controller } from "react-hook-form";
import When from "../../When";
import { Platform } from "react-native";

export const SelectInput = (props: SelectInputProps) => {
  const { theme }: IThemeProvider = useTheme();
  const { options, errors, helperText, ...restProps } = props;

  const [value, setValue] = useState<string>();
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  useEffect(() => {
    const hasError = !!Object.keys(errors ?? {}).length;
    setIsInvalid(hasError);
  }, [errors]);

  return (
    <FormControl isInvalid={isInvalid}>
      <Select
        mb={15}
        selectedValue={value}
        onValueChange={(value) => setValue(value)}
        _selectedItem={{
          endIcon: <CheckIcon size="5" color={theme?.blue} />,
        }}
        _actionSheet={{
          useRNModal: Platform.OS === "ios",
        }}
        {...restProps}
        placeholder={
          props.isRequired ? `${props.placeholder} * ` : props.placeholder
        }
      >
        {options.map((option, index) => (
          <Select.Item label={option.label} value={option.value} key={index} />
        ))}
      </Select>
      <When is={!!helperText}>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {errors?.message}
        </FormControl.ErrorMessage>
      </When>
    </FormControl>
  );
};

export const FormSelectInput = (props: FormSelectInputProps) => {
  const { name, control, options, ...restProps } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <SelectInput
          selectedValue={value}
          onValueChange={onChange}
          options={options}
          {...restProps}
        />
      )}
    />
  );
};
