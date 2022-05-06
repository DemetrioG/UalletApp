import * as React from "react";
import { TouchableOpacity } from "react-native";

import { UserContext } from "../../context/User/userContext";
import { DateContext } from "../../context/Date/dateContext";
import firebase from "../../services/firebase";
import DatePicker from "../DatePicker";
import {
  HeaderIconView,
  HeaderText,
  HeaderView,
  ItemContainer,
  ItemContent,
  ItemText,
  LogoutText,
  MenuContainer,
} from "./styles";
import { StyledIcon, StyledLoader } from "../../styles/generalStyled";
import { colors } from "../../styles";

const optionsMonth = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const optionsYear: number[] = [];

export default function Header({ loader, setLoader }) {
  const { user, setUser } = React.useContext(UserContext);
  const { date, setDate } = React.useContext(DateContext);
  const [menu, setMenu] = React.useState(false);
  const [pickerMonthVisible, setPickerMonthVisible] = React.useState(false);
  const [pickerYearVisible, setPickerYearVisible] = React.useState(false);

  for (let index = 0; index < 15; index++) {
    optionsYear.push(new Date().getFullYear() + index);
  }

  React.useEffect(() => {
    async function getData() {
      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((v) => {
          // Pega o primeiro nome do usuário
          setUser((userState) => ({
            ...userState,
            name: v.data()?.name.split(" ", 1),
          }));
        });
    }

    if (!user.name) {
      getData();
    }

    if (user.name != "" && setLoader) {
      setLoader(false);
    }
  });

  function changeModality() {
    setDate((dateState) => ({
      ...dateState,
      modality: dateState.modality === "Real" ? "Projetado" : "Real",
    }));
  }

  return (
    <HeaderView>
      <DatePicker
        options={optionsMonth}
        type="Mês"
        visibility={pickerMonthVisible}
        setVisibility={setPickerMonthVisible}
        next={setPickerYearVisible}
      />
      <DatePicker
        options={optionsYear}
        type="Ano"
        visibility={pickerYearVisible}
        setVisibility={setPickerYearVisible}
      />
      {loader ? (
        <StyledLoader width={160} height={15} />
      ) : (
        <HeaderText>Bem vindo, {user.name}!</HeaderText>
      )}
      <HeaderIconView>
        <TouchableOpacity>
          <StyledIcon
            name="calendar"
            onPress={() => setPickerMonthVisible(true)}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <StyledIcon name="bell" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenu(!menu)}>
          <StyledIcon name="more-horizontal" />
        </TouchableOpacity>
      </HeaderIconView>
      {menu && (
        <MenuContainer>
          <ItemContainer>
            <ItemContent onPress={changeModality}>
              <ItemText>{date.modality}</ItemText>
              <StyledIcon name="refresh-cw" size={15} color={colors.white} />
            </ItemContent>
          </ItemContainer>
          <ItemContainer>
            <ItemContent>
              <ItemText>Configurações</ItemText>
              <StyledIcon name="settings" size={15} color={colors.white} />
            </ItemContent>
          </ItemContainer>
          <ItemContainer>
            <ItemContent>
              <LogoutText>LOGOUT</LogoutText>
              <StyledIcon name="power" size={15} color={colors.lightRed} />
            </ItemContent>
          </ItemContainer>
        </MenuContainer>
      )}
    </HeaderView>
  );
}
