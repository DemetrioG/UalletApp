import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import firebase from "../../services/firebase";
import { UserContext } from "../../context/User/userContext";
import { DateContext } from "../../context/Date/dateContext";
import { AlertContext } from "../../context/Alert/alertContext";
import Header from "../../components/Header";
import Alert from "../../components/Alert";
import SegmentChart from "../../components/SegmentChart";
import LineChart from "../../components/LineChart";
import { numberToReal } from "../../functions";
import {
  Balance,
  CardFooterText,
  CardHeaderText,
  CardHeaderView,
  CardStatusView,
  CardTextView,
  IconContainer,
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

const LOGO_SMALL = require("../../../assets/images/logoSmall.png");

export default function Home() {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user, setUser } = React.useContext(UserContext);
  const { date } = React.useContext(DateContext);
  const { alert } = React.useContext(AlertContext);

  const [loader, setLoader] = React.useState(false);
  const [headerLoader, setHeaderLoader] = React.useState(true);
  const [balance, setBalance] = React.useState<string | null>(null);
  const [hideBalance, setHideBalance] = React.useState(false);
  const [hideInvest, setHideInvest] = React.useState(false);

  // Retorna o Saldo atual
  function getBalance() {
    if (date.month) {
      firebase
        .firestore()
        .collection("balance")
        .doc(user.uid)
        .collection(date.modality)
        .doc(date.month.toString())
        .onSnapshot((snapshot) => {
          if (snapshot.data()) {
            setBalance(numberToReal(snapshot.data()?.balance));
          } else {
            setBalance("R$ 0,00");
          }
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
    if (!user.complete) {
      completeData();
    }

    getBalance();
  }, [date]);

  if (balance && loader && !headerLoader) {
    setLoader(false);
  }

  return (
    <BackgroundContainer>
      {alert.visibility && <Alert />}
      <Header loader={loader} setLoader={setHeaderLoader} />
      <ScrollViewTab showsVerticalScrollIndicator={false}>
        <Card>
          <CardHeaderView>
            <CardTextView>
              <CardHeaderText>Saldo atual</CardHeaderText>
              <IconContainer
                marginTop={4}
                onPress={() => setHideBalance(!hideBalance)}
              >
                <StyledIcon name={!hideBalance ? "eye" : "eye-off"} size={15} />
              </IconContainer>
            </CardTextView>
            <View>
              <LogoCard source={LOGO_SMALL} width={1} />
            </View>
          </CardHeaderView>
          {loader ? (
            <StyledLoader width={160} height={30} />
          ) : (
            <Balance>{!hideBalance ? balance : "** ** ** ** **"}</Balance>
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
              <IconContainer onPress={() => setHideInvest(!hideInvest)}>
                <StyledIcon name={!hideInvest ? "eye" : "eye-off"} size={15} />
              </IconContainer>
            </CardTextView>
            <TouchableOpacity>
              <StyledIcon name="maximize-2" />
            </TouchableOpacity>
          </CardHeaderView>
          <Invest>{!hideInvest ? "R$ 153.000,00" : "** ** ** ** **"}</Invest>
          <CardTextView>
            <CardFooterText>Rendimento semanal</CardFooterText>
            <InvestPercentual>55%</InvestPercentual>
            <StyledIcon name="arrow-up" size={15} />
          </CardTextView>
        </Card>
        <Card>
          <LineChart />
        </Card>
        <Card>
          {loader ? (
            <StyledLoader width={140} height={140} radius={100} />
          ) : (
            <SegmentChart />
          )}
        </Card>
      </ScrollViewTab>
    </BackgroundContainer>
  );
}
