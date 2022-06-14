import * as React from "react";
import { TextInput, TextInputProps } from "react-native";
import { Control, Controller, FieldValues } from "react-hook-form";
import { AlertContext } from "../../context/Alert/alertContext";

const UTextInput = (
  props: TextInputProps & {
    errors?: object | undefined;
    helperText?: string | undefined;
    required?: boolean;
  }
) => {
  const { setAlert } = React.useContext(AlertContext);

  React.useEffect(() => {
    if (props.errors && Object.keys(props.errors).length > 0) {
      if (props.helperText) {
        setAlert(() => ({
          visibility: true,
          type: "error",
          title: props.helperText!,
        }));
      } else {
        setAlert(() => ({
          visibility: true,
          type: "error",
          title: "Informe todos os campos",
        }));
      }
    }
  }, [props.errors]);

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
