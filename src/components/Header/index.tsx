import * as React from "react";
import { TouchableOpacity } from "react-native";

import { UserContext } from "../../context/User/userContext";
import firebase from "../../services/firebase";
import DatePicker from "../DatePicker";
import { HeaderIconView, HeaderText, HeaderView } from "./styles";
import { StyledIcon, StyledLoader } from "../../styles/general";
import Menu from "../Menu";
interface IHeader {
  loader?: boolean;
  setLoader?: Function;
}

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

export default function Header({ loader, setLoader }: IHeader) {
  const { user, setUser } = React.useContext(UserContext);
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

  return (
    <>
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
      </HeaderView>
      <Menu visibility={menu} />
    </>
  );
}
