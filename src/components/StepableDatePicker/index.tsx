import { memo, useContext, useEffect, useMemo, useRef } from "react";
import { useTheme } from "styled-components";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  Actionsheet,
  FlatList,
  HStack,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import {
  addMonths,
  eachMonthOfInterval,
  endOfYear,
  format,
  parse,
  startOfYear,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { IThemeProvider } from "../../styles/baseTheme";
import {
  ActionSheetItemProps,
  ActionSheetProps,
  StepableDatePickerProps,
} from "./types";
import { DataContext } from "../../context/Data/dataContext";
import { IOption } from "../../types/types";
import { TouchableOpacity } from "react-native";
import { setStorage } from "../../utils/storage.helper";

export const StepableDatePicker = (props: StepableDatePickerProps) => {
  const { theme }: IThemeProvider = useTheme();
  const { data, setData } = useContext(DataContext);
  const action = useDisclose();

  const currentDate = useMemo(
    () => parse(`${data.month}/${data.year}`, "M/yyyy", new Date()),
    [data.month, data.year]
  );

  const formattedDate = useMemo(
    () =>
      data.year
        ? capitalize(format(currentDate, "MMM yyyy", { locale: ptBR }))
        : null,
    [currentDate, data.year]
  );

  function handleArrowPress(type: "prev" | "next") {
    if (!data.year) return;
    const currentDate = new Date(data.year, data.month - 1);
    let nextMonthDate: Date;

    if (type === "next") {
      nextMonthDate = addMonths(currentDate, 1);
    } else {
      nextMonthDate = subMonths(currentDate, 1);
    }

    setStorage("Mês", nextMonthDate.getMonth() + 1);
    setStorage("Ano", nextMonthDate.getFullYear());
    return setData((rest) => ({
      ...rest,
      month: nextMonthDate.getMonth() + 1,
      year: nextMonthDate.getFullYear(),
    }));
  }

  return (
    <HStack justifyContent="space-between">
      <TouchableOpacity
        {...props.SideButtonProps}
        onPress={() => handleArrowPress("prev")}
      >
        <ChevronLeft color={theme?.text} />
      </TouchableOpacity>
      <HStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        {...props.ContainerProps}
      >
        <TouchableOpacity onPress={action.onToggle}>
          <HStack space={1}>
            <Text>{formattedDate}</Text>
            <VStack>
              <ChevronDown color={theme?.text} />
            </VStack>
          </HStack>
        </TouchableOpacity>
      </HStack>
      <TouchableOpacity
        {...props.SideButtonProps}
        onPress={() => handleArrowPress("next")}
      >
        <ChevronRight color={theme?.text} />
      </TouchableOpacity>
      <ActionSheet options={actionSheetOptions} {...action} />
    </HStack>
  );
};

const ActionSheet = (props: ActionSheetProps) => {
  const flatListRef = useRef<typeof FlatList | null>(null);
  const { data, setData } = useContext(DataContext);
  const activeMonthRef = `${data.month}/${data.year}`;
  const activeOptionRef = useMemo(() => {
    return props.options.findIndex((option) =>
      option.value.includes(activeMonthRef)
    );
  }, [props.options, activeMonthRef]);

  function handleUpdateDataContext(option: IOption) {
    const [month, year] = option.value.split("/");

    setStorage("Mês", Number(month));
    setStorage("Ano", Number(year));
    setData((rest) => ({
      ...rest,
      month: Number(month),
      year: Number(year),
    }));
    props.onClose();
  }

  useEffect(() => {
    if (!flatListRef.current) return;
    // @ts-expect-error
    flatListRef.current.scrollToOffset({
      offset: 60 * activeOptionRef + 1,
      animated: true,
    });
  }, [flatListRef, data.month]);

  return (
    <Actionsheet isOpen={props.isOpen} onClose={props.onClose}>
      <Actionsheet.Content>
        <FlatList
          ref={flatListRef}
          style={{ width: "100%", height: 200 }}
          data={props.options}
          keyExtractor={(_, index) => index.toString()}
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
