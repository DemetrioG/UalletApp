import * as React from "react";
import { TextInput, TextInputProps } from "react-native";
import { Control, Controller, FieldValues } from "react-hook-form";
import { AlertContext } from "../../context/Alert/alertContext";

const UTextInput = (
  props: TextInputProps & {
    helperText?: object;
    required?: boolean;
  }
) => {
  const { setAlert } = React.useContext(AlertContext);

  React.useEffect(() => {
    if (props.helperText && Object.keys(props.helperText).length > 0) {
      setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Informe todos os campos",
        redirect: null,
      }));
    }
  }, [props.helperText]);

  return (
    <>
      <TextInput {...props} />
    </>
  );
};

export const DefaultTextInput = ({
  name,
  control,
  ...props
}: React.ComponentProps<typeof UTextInput> & {
  name: string;
  control: Control<FieldValues | any>;
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
