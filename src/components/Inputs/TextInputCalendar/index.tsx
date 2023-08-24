import { useEffect } from "react";
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

  useEffect(() => {
    if (!calendar.isOpen || !props.setDateOnOpen) return;
    setDateToInput(new Date());
  }, [calendar.isOpen]);

  return (
    <VStack position="relative" zIndex={2} alignItems="center">
      <FormTextInput
        name={name}
        masked="datetime"
        maxLength={10}
        withIcon
        helperText="Verifique a data informada"
        setCalendar={calendar.onToggle}
        {...restProps}
      />
      <Calendar setDateToInput={setDateToInput} {...calendar} />
    </VStack>
  );
};
