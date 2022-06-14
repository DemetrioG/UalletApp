import * as React from "react";
import { TextInputMask, TextInputMaskProps } from "react-native-masked-text";
import { Control, Controller, FieldValues } from "react-hook-form";
import { AlertContext } from "../../context/Alert/alertContext";

const UTextInputMask = (
  props: TextInputMaskProps & {
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
      <TextInputMask {...props} />
    </>
  );
};

export const DefaultTextInputMask = ({
  name,
  control,
  ...props
}: React.ComponentProps<typeof UTextInputMask> & {
  name: string;
  control: Control<FieldValues | any>;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <UTextInputMask
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          {...props}
          maxLength={props.type === "datetime" ? 10 : undefined}
        />
      )}
    />
  );
};
