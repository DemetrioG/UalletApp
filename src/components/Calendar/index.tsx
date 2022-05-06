import * as React from "react";
import { Platform, TouchableOpacity, Animated } from "react-native";
import { DateHeader, DateText, StyledDatePicker } from "./styles";

interface ICalendar {
  calendarIsShow: boolean;
  date: Date;
  setDateToInput: Function;
}

export default function Calendar({
  calendarIsShow,
  date,
  setDateToInput,
}: ICalendar) {
  const [dateNow, setDateNow] = React.useState(date);
  const [isShow, setIsShow] = React.useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const notInitialRender = React.useRef(false);

  function showCalendar() {
    if (!isShow) {
      setIsShow(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsShow(false);
      });
    }
  }

  function onClose() {
    showCalendar();
  }

  React.useEffect(() => {
    if (notInitialRender.current) {
      showCalendar();
    } else {
      notInitialRender.current = true;
    }
  }, [calendarIsShow]);

  return (
    <>
      {isShow && (
        <Animated.View
          style={{
            position: "absolute",
            justifyContent: "flex-end",
            width: "100%",
            bottom: 0,
            opacity,
          }}
        >
          {Platform.OS === "ios" && (
            <DateHeader>
              <TouchableOpacity onPress={() => onClose()}>
                <DateText>FECHAR</DateText>
              </TouchableOpacity>
            </DateHeader>
          )}
          <StyledDatePicker
            value={dateNow}
            mode="date"
            display="spinner"
            onChange={({ type }: any, date: any) => {
              if (type === "dismissed") {
                return onClose();
              }
              setDateToInput(date);
              Platform.OS === "android" ? onClose() : null;
            }}
          />
        </Animated.View>
      )}
    </>
  );
}
