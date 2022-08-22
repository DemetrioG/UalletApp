import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button } from "native-base";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Toast from "react-native-toast-message";
import TextInput from "../../components/TextInput";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
interface IForm {
    email: string;
}

const schema = yup
    .object({
        email: yup.string().required(),
    })
    .required();

const ForgotPassword = () => {
    const [loading, setLoading] = React.useState(false);
    const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IForm>({
        resolver: yupResolver(schema),
    });

    function sendPassword({ email }: IForm) {
      setLoading(true);
      resetPassword(email)
          .then((successMessage) => {
              navigate("Login");
              Toast.show({
                  type: "success",
                  text1: successMessage,
              });
          })
          .catch((errorMessage: string) => {
              Toast.show({
                  type: "error",
                  text1: errorMessage,
              });
          })
          .finally(() => setLoading(false));
        
    }

    return (
        <StyledKeyboardAvoidingView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <BackgroundContainer>
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
