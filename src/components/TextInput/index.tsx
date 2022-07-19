import * as React from "react";
import styled from "styled-components";
import { Control, Controller, FieldValues } from "react-hook-form";

import {
    FormControl as NativeFormControl,
    IInputProps,
    Input,
    WarningOutlineIcon,
} from "native-base";
import { metrics } from "../../styles";

const FormControl = styled(NativeFormControl)`
    margin-bottom: ${metrics.baseMargin}px;
`;

const UTextInput = (
    props: IInputProps & {
        errors?: object | undefined;
        helperText?: string | undefined;
    }
) => {
    const [isInvalid, setIsInvalid] = React.useState(false);

    React.useEffect(() => {
        if (props.errors && Object.keys(props.errors).length > 0) {
            setIsInvalid(true);
        }
    }, [props.errors]);

    return (
        <FormControl isInvalid={isInvalid}>
            <Input {...props} />
            <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
            >
                {props.helperText}
            </FormControl.ErrorMessage>
        </FormControl>
    );
};
const StyledTextInput = styled(UTextInput)`
    color: ${({ theme: { theme } }) => theme.text};
`;

const TextInput = ({
    name,
    control,
    ...props
}: React.ComponentProps<typeof UTextInput> & {
    name: string;
    control: Control<FieldValues | any>;
}) => (
    <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                {...props}
            />
        )}
    />
);
export default TextInput;
