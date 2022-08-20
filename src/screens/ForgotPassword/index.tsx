import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button } from "native-base";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Alert from "../../components/Alert";
import TextInput from "../../components/TextInput";
import { AlertContext } from "../../context/Alert/alertContext";
import { DataContext } from "../../context/Data/dataContext";
import { networkConnection } from "../../utils/network.helper";
import {
    BackgroundContainer,
    ButtonText,
    ContainerCenter,
    FormContainer,
    HeaderTitle,
    HeaderTitleContainer,
    LogoHeader,
    StyledKeyboardAvoidingView,
    TextHeader,
} from "../../styles/general";
import { resetPassword } from "./querys";
interface IForm {
    email: string;
}

const schema = yup
    .object({
        email: yup.string().required(),
    })
    .required();

const ForgotPassword = () => {
   const {
        data: { isNetworkConnected },
    } = React.useContext(DataContext);
    const { setAlert } = React.useContext(AlertContext);
    const [loading, setLoading] = React.useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IForm>({
        resolver: yupResolver(schema),
    });

    function sendPassword({ email }: IForm) {
        if (networkConnection(isNetworkConnected!, setAlert)) {
            setLoading(true);
            resetPassword(email)
                .then((successMessage) => {
                    setAlert({
                        visibility: true,
                        title: successMessage,
                        redirect: "Login",
                    });
                })
                .catch((errorMessage: string) => {
                    setAlert({
                        visibility: true,
                        type: "error",
                        title: errorMessage,
                    });
                })
                .finally(() => setLoading(false));
        }
    }

    return (
        <StyledKeyboardAvoidingView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <BackgroundContainer>
                    <Alert />
                    <LogoHeader>
                        <TextHeader withMarginTop fontSize={"2xl"}>
                            Recuperar senha
                        </TextHeader>
                    </LogoHeader>
                    <HeaderTitleContainer>
                        <HeaderTitle>
                            Digite o e-mail cadastrado na sua conta.{"\n"}
                            Enviaremos um e-mail para recuperação da senha.
                        </HeaderTitle>
                    </HeaderTitleContainer>
                    <ContainerCenter>
                        <FormContainer>
                            <TextInput
                                placeholder="E-mail *"
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                name="email"
                                control={control}
                                errors={errors}
                                helperText="Informe um e-mail válido"
                            />
                            <Button
                                isLoading={loading}
                                onPress={handleSubmit(sendPassword)}
                            >
                                <ButtonText>ENVIAR</ButtonText>
                            </Button>
                        </FormContainer>
                    </ContainerCenter>
                </BackgroundContainer>
            </TouchableWithoutFeedback>
        </StyledKeyboardAvoidingView>
    );
};

export default ForgotPassword;
