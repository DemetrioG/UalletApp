import * as React from "react";
import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import { Text } from "native-base";
import Toast from "react-native-toast-message";

import firebase from "@services/firebase";
import { IEntryList } from "../../screens/Entry";
import Icon from "../Icon";
import { numberToReal } from "../../utils/number.helper";
import {
  Label,
  ModalContainer,
  ModalView,
  TextHeaderScreen,
} from "../../styles/general";
import {
  Circle,
  CirclesContainer,
  Footer,
  HeaderContainer,
  HelperContainer,
  HelperText,
  IconContainer,
  InfoContainer,
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
import { consolidateData, getData } from "./query";

const WRITE = require("../../../assets/icons/write.json");

interface IConsolidate {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Consolidate = ({ visible, setVisible }: IConsolidate) => {
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [entryList, setEntryList] = React.useState<
    Array<
      (IEntryList & { checked?: boolean }) | firebase.firestore.DocumentData
    >
  >([]);

  const anySelectedEntry =
    entryList.filter((e) => e.checked || e.checked === false).length > 0;

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
    consolidateData(entryList)
      .then(() => {
        setIsLoading(false);
        setVisible(false);
        return Toast.show({
          type: "success",
          text1: "Dados consolidados com sucesso",
        });
      })
      .catch(() => {
        setIsLoading(false);
        setVisible(false);
        return Toast.show({
          type: "error",
          text1: "Erro ao consolidar os dados",
        });
      });
  }

  const ItemList = ({
    item: { description, type, value, checked, id },
  }: {
    item:
      | (IEntryList & { checked?: boolean })
      | firebase.firestore.DocumentData;
  }) => {
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
                  <Icon name="x" size={20} color={colors.white} />
                </ButtonActionContainer>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAction(id, "check")}>
                <ButtonActionContainer type="check">
                  <Icon name="check" size={20} color={colors.white} />
                </ButtonActionContainer>
              </TouchableOpacity>
            </>
          )}
        </ActionView>
      </ItemView>
    );
  };

  React.useEffect(() => {
    getData().then((data) => {
      setEntryList(data);
    });
  }, []);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <ModalContainer>
        <ModalView>
          <HeaderContainer>
            <TextHeaderScreen noMarginBottom>
              Consolidação de Lançamentos
            </TextHeaderScreen>
            <Icon name="x" onPress={() => setVisible(false)} />
          </HeaderContainer>
          {page === 1 && (
            <View>
              <InfoContainer>
                <Text textAlign={"center"}>
                  Verificamos alguns lançamentos que você Projetou para o dia de
                  hoje.
                </Text>
              </InfoContainer>
              <IconContainer>
                <StyledLottieView source={WRITE} autoPlay loop={false} />
              </IconContainer>
              <HelperContainer>
                <HelperText textAlign={"center"}>
                  Prossiga para realizar a consolidação!
                </HelperText>
              </HelperContainer>
            </View>
          )}
          {page === 2 && (
            <View>
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
                  showsVerticalScrollIndicator={false}
                  data={entryList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => <ItemList item={item} />}
                />
              </DataContainer>
              <InfoContainer>
                <Text textAlign={"center"}>
                  Confirme os lançamentos que realmente aconteceram confirme
                  você Projetou!
                </Text>
              </InfoContainer>
            </View>
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
              <StyledButton onPress={() => setPage(2)}>
                <ButtonText>SEGUINTE</ButtonText>
              </StyledButton>
            ) : (
              <StyledButton
                isLoading={isLoading}
                onPress={() => handleSubmit()}
                isDisabled={!anySelectedEntry}
              >
                <ButtonText>CONFIRMAR</ButtonText>
              </StyledButton>
            )}
          </Footer>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default Consolidate;
