import * as React from "react";
import { TextInputMask, TextInputMaskProps } from "react-native-masked-text";
import { Control, Controller, FieldValues } from "react-hook-form";
import { AlertContext } from "../../context/Alert/alertContext";

const UTextInputMask = (
  props: TextInputMaskProps & {
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
