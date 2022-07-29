import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Calendar from "../../components/Calendar";
import { convertDate } from "../../utils/date.helper";
import {
  BackgroundContainer,
  ContainerCenter,
  FormContainer,
  TextHeaderScreen,
  ViewTab,
  ViewTabContent,
} from "../../styles/general";
import Picker from "../../components/Picker";
import { ASSET_SEGMENT, MODALITY } from "../../components/Picker/options";

interface IForm {
  entrydate: string;
  description: string;
  value: string;
}

const schema = yup
  .object({
    entrydate: yup.string().required(),
    description: yup.string().required(),
    value: yup.string().required(),
  })
  .required();

const NewAsset = () => {
  const navigation = useNavigation();
  const [calendar, setCalendar] = React.useState(false);
  const [segment, setSegment] = React.useState(null);

  const [segmentVisible, setSegmentVisible] = React.useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  function setDateToInput(date: Date) {
    setValue("entrydate", convertDate(date));
  }

  return (
    <BackgroundContainer>
      <ViewTab>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ViewTabContent noPaddingBottom>
            <HStack>
              <Icon
                name="chevron-left"
                style={{ marginRight: 10 }}
                onPress={() => navigation.goBack()}
              />
              <TextHeaderScreen noMarginBottom>
                Novo lançamento
              </TextHeaderScreen>
            </HStack>
            <ContainerCenter>
              <FormContainer insideApp>
                <TextInput
                  name="entrydate"
                  placeholder="Data lançamento"
                  control={control}
                  errors={errors.entrydate}
                  masked="datetime"
                  setCalendar={setCalendar}
                  withIcon
                />
                <Picker
                  options={ASSET_SEGMENT}
                  selectedValue={setSegment}
                  value={!segment ? "Segmento" : segment}
                  type="Segmento"
                  visibility={segmentVisible}
                  setVisibility={setSegmentVisible}
                />
              </FormContainer>
            </ContainerCenter>
            <Calendar
              date={new Date()}
              setDateToInput={setDateToInput}
              calendarIsShow={calendar}
            />
          </ViewTabContent>
        </TouchableWithoutFeedback>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default NewAsset;
