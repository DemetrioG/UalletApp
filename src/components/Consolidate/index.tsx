import * as React from "react";
import { FlatList, Modal, TouchableOpacity } from "react-native";

import firebase from "../../services/firebase";
import { IEntryList } from "../../screens/Entry";
import { UserContext } from "../../context/User/userContext";
import { AlertContext } from "../../context/Alert/alertContext";
import { numberToReal } from "../../utils/number.helper";
import { convertDateFromDatabase, getAtualDate } from "../../utils/date.helper";
import {
  Label,
  ModalContainer,
  ModalView,
  StyledIcon,
  StyledLoading,
  TextHeaderScreen,
} from "../../styles/general";
import {
  Circle,
  CirclesContainer,
  Content,
  Footer,
  HeaderContainer,
  HelperContainer,
  HelperText,
  IconContainer,
  InfoContainer,
  InfoText,
  StyledLottieView,
  StyledButton,
  ButtonText,
  DataContainer,
  DescriptionView,
  DescriptionText,
  ItemView,
  ValueText,
  ValueView,
  LabelContainer,
  ActionView,
  ButtonActionContainer,
  DescriptionSize,
  ValueSize,
  ActionSize,
  ActionText,
} from "./styles";
import { colors } from "../../styles";

const WRITE = require("../../../assets/icons/write.json");

interface IConsolidate {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Consolidate({ visible, setVisible }: IConsolidate) {
  const { user } = React.useContext(UserContext);
  const { setAlert } = React.useContext(AlertContext);
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [entryList, setEntryList] = React.useState<
    Array<
      (IEntryList & { checked?: boolean }) | firebase.firestore.DocumentData
    >
  >([]);

  function handleAction(id: number, type: "check" | "cancel") {
    const list = entryList;
    list.map((item, index) => {
      if (item.id === id) {
        list[index]["checked"] = type !== "cancel";
      }
    });

    setEntryList((listState) => [...listState]);
  }

  function handleRemoveAction(id: number) {
    const list = entryList;
    list.map((item, index) => {
      if (item.id === id) {
        delete list[index].checked;
      }
    });

    setEntryList((listState) => [...listState]);
  }

  async function handleSubmit() {
    setIsLoading(true);
    let newId = 1;

    // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
    await firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection("Real")
      .orderBy("id", "desc")
      .limit(1)
      .get()
      .then((v) => {
        v.forEach((result) => {
          newId += result.data().id;
        });
      });

    entryList.forEach(
      async ({ date, description, segment, type, value, id, checked }) => {
        await firebase
          .firestore()
          .collection("entry")
          .doc(user.uid)
          .collection("Projetado")
          .doc(id.toString())
          .set(
            {
              consolidated: {
                consolidated: checked,
                wasActionShown: true,
              },
            },
            { merge: true }
          )
          .catch(() => {
            setAlert(() => ({
              visibility: true,
              type: "error",
              title: "Erro ao consolidar as informações",
            }));
            return setIsLoading(false);
          });

        if (checked) {
          await firebase
            .firestore()
            .collection("entry")
            .doc(user.uid)
            .collection("Real")
            .doc(newId.toString())
            .set({
              id: newId,
              date: date,
              type: type,
              description: description,
              modality: "Real",
              segment: segment,
              value: value,
            })
            .catch(() => {
              setAlert(() => ({
                visibility: true,
                type: "error",
                title: "Erro ao consolidar as informações",
              }));
              return setIsLoading(false);
            });

          // Atualiza o saldo atual no banco
          let balance = 0;
          await firebase
            .firestore()
            .collection("balance")
            .doc(user.uid)
            .collection("Real")
            .doc(Number(convertDateFromDatabase(date).slice(3, 5)).toString())
            .get()
            .then((v) => {
              balance = v.data()?.balance || 0;
            });

          if (type == "Receita") {
            balance += value;
          } else {
            balance -= value;
          }

          await firebase
            .firestore()
            .collection("balance")
            .doc(user.uid)
            .collection("Real")
            .doc(Number(convertDateFromDatabase(date).slice(3, 5)).toString())
            .set({
              balance: balance,
            });
        }
      }
    );
    setAlert(() => ({
      visibility: true,
      type: "success",
      title: "Dados consolidados com sucesso",
    }));
    return setVisible(false);
  }

  function ItemList({
    item: { description, type, value, checked, id },
  }: {
    item:
      | (IEntryList & { checked?: boolean })
      | firebase.firestore.DocumentData;
  }) {
    return (
      <ItemView>
        <DescriptionView>
          <DescriptionText>
            {description.length > 12
              ? `${description.slice(0, 12)}...`
              : description}
          </DescriptionText>
        </DescriptionView>
        <ValueView>
          <ValueText type={type}>{type == "Receita" ? "+" : "-"}</ValueText>
          <ValueText type={type}>{numberToReal(value)}</ValueText>
        </ValueView>
        <ActionView>
          {checked !== undefined ? (
            <TouchableOpacity onPress={() => handleRemoveAction(id)}>
              <ActionText checked={checked}>
                {checked ? "Consolidado" : "Não consolidado"}
              </ActionText>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => handleAction(id, "cancel")}>
                <ButtonActionContainer type="cancel">
                  <StyledIcon name="x" size={20} color={colors.white} />
                </ButtonActionContainer>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAction(id, "check")}>
                <ButtonActionContainer type="check">
                  <StyledIcon name="check" size={20} color={colors.white} />
                </ButtonActionContainer>
              </TouchableOpacity>
            </>
          )}
        </ActionView>
      </ItemView>
    );
  }

  React.useEffect(() => {
    (async function getData() {
      const date = getAtualDate();
      const initialDate = date[1];
      const finalDate = date[2];

      setEntryList([]);
      await firebase
        .firestore()
        .collection("entry")
        .doc(user.uid)
        .collection("Projetado")
        .where("date", ">=", initialDate)
        .where("date", "<=", finalDate)
        .where("consolidated.wasActionShown", "==", false)
        .get()
        .then((v) => {
          v.forEach((result) => {
            setEntryList((listState) => [...listState, result.data()]);
          });
        });
    })();
  }, []);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <ModalContainer>
        <ModalView large>
          <HeaderContainer>
            <TextHeaderScreen noMarginBottom>
              Consolidação de Lançamentos
            </TextHeaderScreen>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <StyledIcon name="x" />
            </TouchableOpacity>
          </HeaderContainer>
          {page === 1 && (
            <Content>
              <InfoContainer>
                <InfoText>
                  Verificamos alguns lançamentos que você Projetou para o dia de
                  hoje.
                </InfoText>
              </InfoContainer>
              <IconContainer>
                <StyledLottieView source={WRITE} autoPlay loop={false} />
              </IconContainer>
              <HelperContainer>
                <HelperText>Prossiga para realizar a consolidação!</HelperText>
              </HelperContainer>
            </Content>
          )}
          {page === 2 && (
            <Content>
              <DataContainer>
                <LabelContainer>
                  <DescriptionSize>
                    <Label>DESCRIÇÃO</Label>
                  </DescriptionSize>
                  <ValueSize>
                    <Label>VALOR</Label>
                  </ValueSize>
                  <ActionSize>
                    <Label>AÇÃO</Label>
                  </ActionSize>
                </LabelContainer>
                <FlatList
                  style={{
                    height: 185,
                  }}
                  showsVerticalScrollIndicator={false}
                  data={entryList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => <ItemList item={item} />}
                />
              </DataContainer>
              <InfoContainer>
                <InfoText>
                  Confirme os lançamentos que realmente aconteceram confirme
                  você Projetou!
                </InfoText>
              </InfoContainer>
            </Content>
          )}
          <Footer>
            <CirclesContainer>
              <TouchableOpacity onPress={() => setPage(1)}>
                <Circle isActive={page === 1} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPage(2)}>
                <Circle isActive={page === 2} />
              </TouchableOpacity>
            </CirclesContainer>
            {page === 1 ? (
              <StyledButton small onPress={() => setPage(2)}>
                <ButtonText>SEGUINTE</ButtonText>
              </StyledButton>
            ) : (
              <StyledButton small onPress={() => handleSubmit()}>
                <ButtonText>
                  {isLoading ? <StyledLoading /> : "CONFIRMAR"}
                </ButtonText>
              </StyledButton>
            )}
          </Footer>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
}
