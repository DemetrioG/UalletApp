import * as React from "react";

import firebase from "../../services/firebase";
import Menu from "../Menu";
import DatePicker from "../DatePicker";
import { UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";
import { HeaderIconView, HeaderText, HeaderView, NetworkCard } from "./styles";
import { Skeleton } from "../../styles/general";
import Icon from "../Icon";

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

const Header = () => {
  const { data } = React.useContext(DataContext);
  const { user, setUser } = React.useContext(UserContext);
  const { loader, setLoader } = React.useContext(LoaderContext);
  const [pickerMonthVisible, setPickerMonthVisible] = React.useState(false);
  const [pickerYearVisible, setPickerYearVisible] = React.useState(false);

  function handleHide() {
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
            // Retorna o nome do usuário
            setUser((userState) => ({
              ...userState,
              name: v.data()?.name.split(" ", 1).toString(),
              completeName: v.data()?.name,
              email: v.data()?.email,
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
        <Skeleton isLoaded={!loader.homeVisible} h={4} width={150} secondary>
          <HeaderText>Bem vindo (a), {user.name}!</HeaderText>
        </Skeleton>
        <HeaderIconView>
          <Icon
            name={!user.hideNumbers ? "eye" : "eye-off"}
            onPress={handleHide}
          />
          <Icon name="calendar" onPress={() => setPickerMonthVisible(true)} />
          <Icon name="bell" />
          <Menu />
        </HeaderIconView>
      </HeaderView>
      {!data.isNetworkConnected && (
        <NetworkCard>
          <HeaderText>Sem conexão com a internet</HeaderText>
          <Icon name="wifi-off" colorVariant="red" />
        </NetworkCard>
      )}
    </>
  );
};

export default Header;
