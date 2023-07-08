import { VStack, useDisclose } from "native-base";
import Calendar from "../../Calendar";
import { FormTextInput } from "../TextInput";
import { FormTextInputCalendarProps } from "./types";
import { convertDate } from "../../../utils/date.helper";

export const FormTextInputCalendar = (props: FormTextInputCalendarProps) => {
  const { formMethods, name, ...restProps } = props;
  const calendar = useDisclose();

  function setDateToInput(date: Date) {
    formMethods.setValue(name, convertDate(date));
  }

  return (
    <VStack position="relative" zIndex={2} alignItems="center">
      <FormTextInput
        {...restProps}
        name={name}
        masked="datetime"
        maxLength={10}
        withIcon
        helperText="Verifique a data informada"
        setCalendar={calendar.onToggle}
      />
      <Calendar setDateToInput={setDateToInput} {...calendar} />
    </VStack>
  );
};
