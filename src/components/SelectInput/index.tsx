import { CheckIcon, Select } from "native-base";
import { SelectInputProps } from "./types";
import { useState } from "react";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";

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
    >
      {options.map((option, index) => (
        <Select.Item label={option.label} value={option.value} key={index} />
      ))}
    </Select>
  );
};
