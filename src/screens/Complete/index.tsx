import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../services/firebase";
import Picker from "../../components/Picker";
import Alert from "../../components/Alert";
import TextInput from "../../components/TextInput";
import { UserContext } from "../../context/User/userContext";
import { AlertContext } from "../../context/Alert/alertContext";
import { dateValidation } from "../../utils/date.helper";
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

const Complete = () => {
  const { user } = React.useContext(UserContext);
  const { setAlert } = React.useContext(AlertContext);
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
      return setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Informe todos os campos",
      }));
    } else if (income == "R$0,00") {
      return setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Informe uma renda média",
      }));
    } else if (!dateValidation(birthdate)) {
      return setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Verifique a data de nascimento informada",
      }));
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
              }));
            });
        }
        return setLoading(false);
      });
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <Alert />
          <LogoHeader>
            <TextHeader fontSize={"2xl"}>Complete seu cadastro</TextHeader>
          </LogoHeader>
          <HeaderTitleContainer>
            <HeaderTitle>
              Seus dados serão utilizados para melhorar{"\n"}sua experiência
              dentro do app.
            </HeaderTitle>
          </HeaderTitleContainer>
          <ContainerCenter>
            <FormContainer>
              <Picker
                options={optionsGender}
                selectedValue={setGender}
                value={!gender ? "Sexo" : gender}
                type="Sexo"
                visibility={genderVisible}
                setVisibility={setGenderVisible}
              />
              <Picker
                options={optionsProfile}
                selectedValue={setProfile}
                value={!profile ? "Perfil" : profile}
                type="Perfil"
                visibility={profileVisible}
                setVisibility={setProfileVisible}
              />
              <TextInput
                placeholder="Data de nascimento"
                name="birthdate"
                control={control}
                maxLength={10}
                masked="datetime"
                errors={errors.birthdate}
              />
              <TextInput
                placeholder="Renda média"
                name="income"
                control={control}
                errors={errors.income}
                masked="money"
                helperText="Informe todos os campos"
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
