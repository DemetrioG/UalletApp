import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Text } from "native-base";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Picker from "@components/Picker";
import TextInput from "@components/TextInput";
import { UserContext } from "@context/User/userContext";
import { dateValidation } from "@utils/date.helper";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  HeaderTitleContainer,
  LogoHeader,
  StyledKeyboardAvoidingView,
} from "@styles/general";
import { GENDER, PROFILE } from "@components/Picker/options";
import { updateUserData } from "./querys";

interface IForm {
  birthdate: string;
  gender: string;
  profile: string;
  income: string;
}

const Complete = () => {
  const { user } = React.useContext(UserContext);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  const [gender, setGender] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [genderVisible, setGenderVisible] = React.useState(false);
  const [profileVisible, setProfileVisible] = React.useState(false);

  const schema = yup
    .object({
      birthdate: yup
        .string()
        .required()
        .min(10)
        .test("date", "Verifique a data informada", (value) =>
          dateValidation(value!)
        ),
      gender: yup.string().test("gender", "Informe seu sexo", () => gender!),
      profile: yup
        .string()
        .test("profile", "Infome seu perfil", () => profile!),
      income: yup
        .string()
        .required()
        .test(
          "income",
          "Informe uma renda média",
          (value) => value !== "R$0,00"
        ),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  function registerData({ birthdate, income }: IForm) {
    const userData = {
      birthDate: birthdate,
      gender: gender,
      income: income,
      profile: profile,
    };

    setLoading(true);
    updateUserData(userData)
      .then(() => {
        navigate("Home");
        Toast.show({
          type: "success",
          text1: "Dados cadastrados com sucesso",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao cadastrar as informações",
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <LogoHeader>
            <Text fontSize={"2xl"} fontWeight={800}>
              Complete seu cadastro
            </Text>
          </LogoHeader>
          <HeaderTitleContainer>
            <Text>
              Seus dados serão utilizados para melhorar{"\n"}sua experiência
              dentro do app.
            </Text>
          </HeaderTitleContainer>
          <ContainerCenter>
            <FormContainer>
              <Picker
                options={GENDER}
                selectedValue={setGender}
                value={!gender ? "Sexo" : gender}
                type="Sexo"
                visibility={genderVisible}
                setVisibility={setGenderVisible}
                errors={errors.gender}
              />
              <Picker
                options={PROFILE}
                selectedValue={setProfile}
                value={!profile ? "Perfil" : profile}
                type="Perfil"
                visibility={profileVisible}
                setVisibility={setProfileVisible}
                errors={errors.profile}
              />
              <TextInput
                placeholder="Data de nascimento"
                name="birthdate"
                control={control}
                maxLength={10}
                masked="datetime"
                errors={errors.birthdate}
                helperText="Verifique a data informada"
              />
              <TextInput
                placeholder="Renda média"
                name="income"
                control={control}
                errors={errors.income}
                masked="money"
                helperText={
                  errors.income?.message === "Informe uma renda média"
                    ? errors.income.message
                    : "Informe todos os campos"
                }
              />
              <Button isLoading={loading} onPress={handleSubmit(registerData)}>
                <ButtonText>CONFIRMAR</ButtonText>
              </Button>
            </FormContainer>
          </ContainerCenter>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
};

export default Complete;
