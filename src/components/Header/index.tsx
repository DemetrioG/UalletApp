import * as React from "react";
import { TouchableOpacity } from "react-native";

import firebase from "../../services/firebase";
import Menu from "../Menu";
import DatePicker from "../DatePicker";
import { UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";
import { setStorage } from "../../utils/storage.helper";
import { HeaderIconView, HeaderText, HeaderView, NetworkCard } from "./styles";
import { StyledIcon, StyledLoader } from "../../styles/general";

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

for (let index = 0; index < 5; index++) {
  optionsYear.push(new Date().getFullYear() + index);
}

export default function Header() {
  const { data } = React.useContext(DataContext);
  const { user, setUser } = React.useContext(UserContext);
  const { loader, setLoader } = React.useContext(LoaderContext);
  const [menu, setMenu] = React.useState(false);
  const [pickerMonthVisible, setPickerMonthVisible] = React.useState(false);
  const [pickerYearVisible, setPickerYearVisible] = React.useState(false);

  function handleHide() {
    setStorage("hideNumbers", !user.hideNumbers);
    setUser((userState) => ({
      ...userState,
      hideNumbers: !userState.hideNumbers,
    }));
  }

  React.useEffect(() => {
    if (!user.name) {
      (async function getData() {
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
          })
          .catch(() => {
            setUser((userState) => ({
              ...userState,
              name: "",
            }));
          });
      })();
    }

    if (user.name.length) {
      setLoader((loaderState) => ({
        ...loaderState,
        name: true,
      }));
    }
  }, [user]);

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
        {loader.visible ? (
          <StyledLoader width={160} height={15} radius={6} />
        ) : (
          <HeaderText>Bem vindo (a), {user.name}!</HeaderText>
        )}
        <HeaderIconView>
          <TouchableOpacity onPress={handleHide}>
            <StyledIcon name={!user.hideNumbers ? "eye" : "eye-off"} />
          </TouchableOpacity>
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
      {!data.isNetworkConnected && (
        <NetworkCard>
          <HeaderText>Sem conexão com a internet</HeaderText>
          <StyledIcon name="wifi-off" colorVariant="red" />
        </NetworkCard>
      )}
      <Menu visibility={menu} />
    </>
  );
}
