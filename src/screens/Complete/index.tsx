import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../services/firebase";
import { UserContext } from "../../context/User/userContext";
import { AlertContext } from "../../context/Alert/alertContext";
import Picker from "../../components/Picker";
import Alert from "../../components/Alert";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  HeaderTitle,
  HeaderTitleContainer,
  LogoHeader,
  StyledButton,
  StyledKeyboardAvoidingView,
  StyledLoading,
  StyledTextInputMask,
  TextHeader,
} from "../../styles/general";
import { colors } from "../../styles";

interface IForm {
  birthdate: string;
  income: string;
}

const schema = yup
  .object({
    birthdate: yup.string().required(),
    income: yup.string().required(),
  })
  .required();

export default function Complete() {
  const { user } = React.useContext(UserContext);
  const { alert, setAlert } = React.useContext(AlertContext);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  const [gender, setGender] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [genderVisible, setGenderVisible] = React.useState(false);
  const [profileVisible, setProfileVisible] = React.useState(false);

  const optionsGender = ["Feminino", "Masculino"];
  const optionsProfile = ["Investidor", "Poupador", "Gastador"];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  function registerData({ birthdate, income }: IForm) {
    if (!gender || !profile) {
      setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Informe todos os campos",
        redirect: null,
      }));
      return;
    } else if (income == "R$0,00") {
      setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Informe uma renda média",
        redirect: null,
      }));
      return;
    }

    setLoading(true);
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((v) => {
        if (v.data()) {
          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set(
              {
                birthDate: birthdate,
                gender: gender,
                income: income,
                profile: profile,
              },
              { merge: true }
            )
            .then(() => {
              navigate("Home");
              setAlert(() => ({
                visibility: true,
                type: "success",
                title: "Dados cadastrados com sucesso",
                redirect: "Home",
              }));
            })
            .catch(() => {
              setAlert(() => ({
                visibility: true,
                type: "error",
                title: "Erro ao cadastrar as informações",
                redirect: null,
              }));
            });
        }
        setLoading(false);
      });
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          {alert.visibility && <Alert />}
          <LogoHeader>
            <TextHeader>Complete seu cadastro</TextHeader>
          </LogoHeader>
          <HeaderTitleContainer>
            <HeaderTitle>
              Seus dados serão utilizados para melhorar{"\n"}sua experiência
              dentro do app.
            </HeaderTitle>
          </HeaderTitleContainer>
          <ContainerCenter>
            <FormContainer>
              <StyledTextInputMask
                placeholder="Data de nascimento"
                type="datetime"
                name="birthdate"
                control={control}
                maxLength={10}
              />
              <Picker
                options={optionsGender}
                selectedValue={setGender}
                value={!gender ? "Sexo" : gender}
                type="Sexo"
                visibility={genderVisible}
                setVisibility={setGenderVisible}
              />
              <StyledTextInputMask
                placeholder="Renda média"
                type="money"
                name="income"
                control={control}
                errors={errors}
              />
              <Picker
                options={optionsProfile}
                selectedValue={setProfile}
                value={!profile ? "Perfil" : profile}
                type="Perfil"
                visibility={profileVisible}
                setVisibility={setProfileVisible}
              />
              <StyledButton onPress={handleSubmit(registerData)}>
                {loading ? (
                  <StyledLoading />
                ) : (
                  <ButtonText>CONFIRMAR</ButtonText>
                )}
              </StyledButton>
            </FormContainer>
          </ContainerCenter>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
}
