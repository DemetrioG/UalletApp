import * as React from "react";
import { Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import When from "../When";
import { ReturnUseDisclosure } from "../../types/types";
import { Text, VStack } from "native-base";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";

interface ICalendar extends ReturnUseDisclosure {
  setDateToInput: Function;
}

const Calendar = ({ setDateToInput, isOpen, onClose }: ICalendar) => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <When is={isOpen}>
      <VStack position="absolute" w="95%" top="48px" borderRadius={10}>
        <DateTimePicker
          style={{ backgroundColor: theme?.tertiary }}
          value={new Date()}
          mode="date"
          display="spinner"
          onChange={({ type }: any, date: any) => {
            if (type === "dismissed") return onClose();
            setDateToInput(date);
            Platform.OS === "android" && onClose();
          }}
        />
        <When is={Platform.OS === "ios"}>
          <VStack
            w="100%"
            justifyContent="center"
            alignItems="flex-end"
            p={4}
            backgroundColor={theme?.tertiary}
            borderBottomLeftRadius="30px"
            borderBottomRightRadius="30px"
            borderTopWidth="1px"
          >
            <TouchableOpacity onPress={onClose}>
              <Text fontSize="14px" fontWeight={600}>
                FECHAR
              </Text>
            </TouchableOpacity>
          </VStack>
        </When>
      </VStack>
    </When>
  );
};

export default Calendar;
