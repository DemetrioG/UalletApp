import { memo, useContext, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  Actionsheet,
  FlatList,
  HStack,
  Pressable,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ActionSheetItemProps, ActionSheetProps } from "./types";
import {
  eachMonthOfInterval,
  endOfYear,
  format,
  parse,
  startOfYear,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { DataContext } from "../../context/Data/dataContext";
import { IOption } from "../../types/types";

export const StepableDatePicker = () => {
  const { theme }: IThemeProvider = useTheme();
  const { data } = useContext(DataContext);
  const action = useDisclose();

  const currentDate = parse(`${data.month}/${data.year}`, "M/yyyy", new Date());
  const formattedDate = data.year
    ? capitalize(format(currentDate, "MMM yyyy", { locale: ptBR }))
    : null;

  return (
    <HStack borderWidth={1} justifyContent="space-between">
      <Pressable p={1.5} borderWidth={1} borderColor={theme?.secondary}>
        <ChevronLeft color={theme?.text} />
      </Pressable>
      <HStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        borderTopWidth={1}
        borderBottomWidth={1}
        borderColor={theme?.secondary}
      >
        <Pressable onPress={action.onToggle}>
          <HStack space={1}>
            <Text>{formattedDate}</Text>
            <VStack>
              <ChevronDown color={theme?.text} />
            </VStack>
          </HStack>
        </Pressable>
      </HStack>
      <Pressable p={1.5} borderWidth={1} borderColor={theme?.secondary}>
        <ChevronRight color={theme?.text} />
      </Pressable>
      <ActionSheet options={actionSheetOptions} {...action} />
    </HStack>
  );
};

const ActionSheet = (props: ActionSheetProps) => {
  const [ref, setRef] = useState<unknown | null>(null);
  const { setData } = useContext(DataContext);

  function handleUpdateDataContext(option: IOption) {
    const [month, year] = option.value.split("/");
    setData((rest) => ({
      ...rest,
      month: Number(month),
      year: Number(year),
    }));
    props.onClose();
  }

  // useEffect(() => {
  //   if (!ref) return;
  //   // @ts-expect-error
  //   ref.scrollTo({
  //     x: 0,
  //     y: 60 * 4,
  //     animated: true,
  //   });
  // }, [ref]);

  return (
    <Actionsheet isOpen={props.isOpen} onClose={props.onClose}>
      <Actionsheet.Content>
        <FlatList
          style={{ width: "100%", height: 200 }}
          // ref={(ref) => {
          //   setRef(ref);
          // }}
          data={props.options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ActionSheetItem
              item={item}
              onPress={() => handleUpdateDataContext(item)}
            />
          )}
        />
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const ActionSheetItem = memo(({ item, onPress }: ActionSheetItemProps) => {
  return (
    <Actionsheet.Item h={60} onPress={onPress}>
      {item.label}
    </Actionsheet.Item>
  );
});

const startYear = 2020;
const currentYear = new Date().getFullYear();
const futureYear = currentYear + 10;

const years = eachMonthOfInterval({
  start: startOfYear(new Date(startYear, 0)),
  end: endOfYear(new Date(futureYear, 6)),
});

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const actionSheetOptions = years.map((year) => ({
  label: capitalize(format(year, "MMM yyyy", { locale: ptBR })),
  value: format(year, "MM/yyyy"),
}));
