import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, HStack, VStack } from "native-base";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import * as yup from "yup";

import Icon from "../../../../components/Icon";
import TextInputPassword from "../../../../components/TextInputPassword";
import {
    BackgroundContainer,
    ButtonText,
    FormContainer,
    StyledKeyboardAvoidingView,
    TextHeaderScreen,
    ViewTab,
} from "../../../../styles/general";
import PasswordRules from "../../../Register/PasswordRules";
import { changePassword } from "./querys";
import { AlertContext } from "../../../../context/Alert/alertContext";

const defaultValues = {
    oldPassword: "",
    newPassword: "",
};

const schema = yup
    .object({
        newPassword: yup
            .string()
            .required()
            .matches(
                new RegExp(
                    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                )
            ),
        oldPassword: yup.string().required(),
    })
    .required();

export const AlterarSenhaScreen = () => {
    const [loading, setLoading] = React.useState(false);
    const { setAlert } = React.useContext(AlertContext);
    const { goBack, navigate } = useNavigation();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    async function onSubmit(formValues: typeof defaultValues) {
        setLoading(true);

        const changed = await changePassword(formValues);

        if (!changed) {
            setAlert({
                type: "error",
                title: "A senha antiga é inválida",
                callback: true,
                callbackFunction: () =>
                    setError(
                        "oldPassword",
                        { message: "error", type: "value" },
                    ),
            });
            return setLoading(false);
        }

        return setAlert({
            title: "Senha alterada com sucesso",
            redirect: "Home",
        });
    }

    return (
        <StyledKeyboardAvoidingView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <BackgroundContainer>
                    <ViewTab>
                        <HStack alignItems="center" space={3} mb={10}>
                            <Icon
                                name="chevron-left"
                                size={24}
                                onPress={goBack}
                            />
                            <TextHeaderScreen noMarginBottom>
                                Alterar Senha
                            </TextHeaderScreen>
                        </HStack>
                        <VStack flex={1} justifyContent="center">
                            <FormContainer>
                                <TextInputPassword
                                    placeholder="Senha atual *"
                                    name="oldPassword"
                                    returnKeyType="done"
                                    control={control}
                                    errors={errors.oldPassword}
                                />
                                <TextInputPassword
                                    placeholder="Nova senha *"
                                    returnKeyType="done"
                                    name="newPassword"
                                    control={control}
                                    errors={errors.newPassword}
                                    helperText="Informe todos os campos"
                                />
                                <PasswordRules content={watch("newPassword")} />
                                <Button
                                    mt={5}
                                    isLoading={loading}
                                    onPress={handleSubmit(onSubmit)}
                                >
                                    <ButtonText>ALTERAR SENHA</ButtonText>
                                </Button>
                            </FormContainer>
                        </VStack>
                    </ViewTab>
                </BackgroundContainer>
            </TouchableWithoutFeedback>
        </StyledKeyboardAvoidingView>
    );
};
