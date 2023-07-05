import { CheckIcon, Select } from "native-base";
import { FormSelectInputProps, SelectInputProps } from "./types";
import { useState } from "react";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { Controller } from "react-hook-form";

export const SelectInput = (props: SelectInputProps) => {
  const { theme }: IThemeProvider = useTheme();
  const { options, ...restProps } = props;

  const [value, setValue] = useState<string>();

  return (
    <Select
      mb={15}
      selectedValue={value}
      onValueChange={(value) => setValue(value)}
      _selectedItem={{
        endIcon: <CheckIcon size="5" color={theme?.blue} />,
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
