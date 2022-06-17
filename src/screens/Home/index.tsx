import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import firebase from "../../services/firebase";
import { UserContext } from "../../context/User/userContext";
import { DateContext } from "../../context/Date/dateContext";

import Consolidate from "../../components/Consolidate";
import Header from "../../components/Header";
import Alert from "../../components/Alert";
import SegmentChart from "../../components/SegmentChart";
import LineChart from "../../components/LineChart";
import {
  Balance,
  CardFooterText,
  CardHeaderText,
  CardHeaderView,
  CardStatusView,
  CardTextView,
  Invest,
  InvestPercentual,
  LogoCard,
  StatusPercentText,
  StatusText,
} from "./styles";
import {
  BackgroundContainer,
  Card,
  ScrollViewTab,
  StyledIcon,
  StyledLoader,
} from "../../styles/general";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";
import { numberToReal } from "../../utils/number.helper";

const LOGO_SMALL = require("../../../assets/images/logoSmall.png");

export default function Home() {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user, setUser } = React.useContext(UserContext);
  const { loader, setLoader } = React.useContext(LoaderContext);
  const { data, setData } = React.useContext(DataContext);
  const { date } = React.useContext(DateContext);
  const [consolidate, setConsolidate] = React.useState(false);

  // Retorna o Saldo atual
  function getBalance() {
    if (date.year !== 0) {
      firebase
        .firestore()
        .collection("balance")
        .doc(user.uid)
        .collection(date.modality)
        .doc(date.month.toString())
        .onSnapshot((snapshot) => {
          setData((dataState) => ({
            ...dataState,
            balance: snapshot.data()
              ? numberToReal(snapshot.data()?.balance)
              : "R$ 0,00",
          }));

          !loader.balance
            ? setLoader((loaderState) => ({
                ...loaderState,
                balance: true,
              }))
            : null;
        });
    }
  }

  async function completeData() {
    await firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((v) => {
        setUser((userState) => ({
          ...userState,
          complete: true,
        }));
        // Verifica se tem todas as informações de usuário preenchidas no banco, se não, builda a tela de preenchimento
        if (!v.data()?.birthDate) {
          navigate("Complete");
        }
      });
  }

  React.useEffect(() => {
    (async () => {
      await firebase
        .firestore()
        .collection("entry")
        .doc(user.uid)
        .collection("Projetado")
        .where("consolidated", "==", false)
        .get()
        .then((v) => {
          v.forEach((result) => {
            result.data() && setConsolidate(true);
          });
        });
    })();
  }, []);

  React.useEffect(() => {
    getBalance();
    if (!user.complete) {
      completeData();
    }
  }, [date]);

  React.useEffect(() => {
    if (
      loader.name &&
      loader.balance &&
      loader.lineChart &&
      loader.segmentChart &&
      loader.visible
    ) {
      setLoader((loaderState) => ({
        ...loaderState,
        visible: false,
      }));
    }
  }, [loader]);

  return (
    <BackgroundContainer>
      <Consolidate visible={consolidate} setVisible={setConsolidate} />
      <Alert />
      <Header />
      <ScrollViewTab showsVerticalScrollIndicator={false}>
        <Card>
          <CardHeaderView>
            <CardTextView>
              <CardHeaderText>Saldo atual</CardHeaderText>
            </CardTextView>
            <View>
              <LogoCard source={LOGO_SMALL} width={1} />
            </View>
          </CardHeaderView>
          {loader.visible ? (
            <StyledLoader width={160} height={30} radius={10} />
          ) : (
            <Balance negative={data.balance?.includes("-")}>
              {!user.hideNumbers ? data.balance : "** ** ** ** **"}
            </Balance>
          )}
        </Card>
        <Card>
          <CardStatusView>
            <StatusText bold={true}>Você está indo bem</StatusText>
          </CardStatusView>
          <CardStatusView>
            <StatusText>
              Sua média de gastos variáveis semanal está representando{" "}
              <StatusPercentText>3%</StatusPercentText> de sua renda
            </StatusText>
          </CardStatusView>
          <View>
            <StatusText bold={true}>Continue!! ⚡</StatusText>
          </View>
        </Card>
        <Card>
          <CardHeaderView>
            <CardTextView>
              <CardHeaderText>Patrimônio investido</CardHeaderText>
            </CardTextView>
            <TouchableOpacity>
              <StyledIcon name="maximize-2" />
            </TouchableOpacity>
          </CardHeaderView>
          <Invest>
            {!user.hideNumbers ? "R$ 153.000,00" : "** ** ** ** **"}
          </Invest>
          <CardTextView>
            <CardFooterText>Rendimento semanal</CardFooterText>
            <InvestPercentual>55%</InvestPercentual>
            <StyledIcon name="arrow-up" size={15} colorVariant="green" />
          </CardTextView>
        </Card>
        <Card>
          <LineChart />
        </Card>
        <Card>
          <SegmentChart />
        </Card>
      </ScrollViewTab>
    </BackgroundContainer>
  );
}
