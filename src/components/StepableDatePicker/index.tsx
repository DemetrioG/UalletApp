import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "styled-components";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { FlatList, HStack, Text, VStack, useDisclose } from "native-base";
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
import { Modal } from "../Modal";
import When from "../When";

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
        // onPress={() => handleArrowPress("prev")}
      >
        <ChevronLeft color={"transparent"} />
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
        // onPress={() => handleArrowPress("next")}
      >
        <ChevronRight color={"transparent"} />
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

  const [xRef, setXRef] = useState(0);

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

  /**
   * Por algum acaso o contentOffset não funciona ao renderizar.
   * Sendo assim, forço uma re-renderização com essa state
   */
  useEffect(() => {
    setTimeout(() => setXRef((ref) => ref + 1), 100);
  }, [props.isOpen]);

  return (
    <Modal
      {...props}
      ContainerProps={{
        backgroundColor: "#FAFAFA",
        h: "40%",
        borderRadius: 20,
        alignItems: "center",
      }}
    >
      <VStack backgroundColor="#737373" w="40px" h="4px" borderRadius={2} />
      <FlatList
        ref={flatListRef}
        style={{ width: "100%", height: 200 }}
        data={props.options}
        keyExtractor={(_, index) => index.toString()}
        contentOffset={{ x: xRef, y: 60 * activeOptionRef + 1 }}
        renderItem={({ item }) => (
          <ActionSheetItem
            item={item}
            activeRef={activeMonthRef}
            onPress={() => handleUpdateDataContext(item)}
          />
        )}
      />
    </Modal>
  );
};

const ActionSheetItem = memo(
  ({ item, onPress, activeRef }: ActionSheetItemProps) => {
    const [month, year] = activeRef.split("/");
    const [itemMonth, itemYear] = item.value.split("/");
    const isCurrent =
      Number(month) === Number(itemMonth) && Number(year) === Number(itemYear);

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          height: 60,
          justifyContent: "center",
          paddingHorizontal: 10,
        }}
      >
        <HStack alignItems="center" space={3}>
          <Text color="black">{item.label}</Text>
          <When is={isCurrent}>
            <Check color="#266DD3" />
          </When>
        </HStack>
      </TouchableOpacity>
    );
  }
);

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
