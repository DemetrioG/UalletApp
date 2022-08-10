import { HStack, VStack } from "native-base";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import * as yup from "yup";

import Icon from "../../../../components/Icon";
import TextInputPassword from "../../../../components/TextInputPassword";
import {
    BackgroundContainer,
    FormContainer,
    TextHeaderScreen,
    ViewTab,
} from "../../../../styles/general";
import PasswordRules from "../../../Register/PasswordRules";

const schema = yup
    .object({
        password: yup
            .string()
            .required()
            .matches(
                new RegExp(
                    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                )
            ),
    })
    .required();

export const AlterarSenhaScreen = () => {
    const { goBack } = useNavigation();
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<{ password: string }>({
        resolver: yupResolver(schema),
    });

    return (
        <BackgroundContainer>
            <ViewTab>
                <HStack alignItems="center" space={3} mb={10}>
                    <Icon name="chevron-left" size={24} onPress={goBack} />
                    <TextHeaderScreen noMarginBottom>
                        Alterar Senha
                    </TextHeaderScreen>
                </HStack>
                <VStack flex={1} justifyContent="center">
                    <FormContainer>
                        <TextInputPassword
                            placeholder="Senha *"
                            name="password"
                            control={control}
                            errors={errors.password}
                        />
                        <TextInputPassword
                            placeholder="Confirme sua senha *"
                            onSubmitEditing={handleSubmit(() => {})}
                            returnKeyType="done"
                            name="confirm"
                            control={control}
                            errors={errors.password}
                            helperText="Informe todos os campos"
                        />
                        <PasswordRules content={watch("password")} />
                    </FormContainer>
                </VStack>
            </ViewTab>
        </BackgroundContainer>
    );
};
