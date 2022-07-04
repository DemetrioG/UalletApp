import * as React from "react";
import { Platform, TouchableOpacity, Animated } from "react-native";
import { DateHeader, DateText, StyledDatePicker } from "./styles";

interface ICalendar {
  calendarIsShow: boolean;
  date: Date;
  setDateToInput: Function;
  edit?: boolean;
}

export default function Calendar({
  calendarIsShow,
  date,
  setDateToInput,
  edit,
}: ICalendar) {
  const [isShow, setIsShow] = React.useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const notInitialRender = React.useRef(false);

  function calendarVisibility() {
    if (!isShow) {
      setIsShow(true);
      !edit && setDateToInput(date);
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

  React.useEffect(() => {
    if (notInitialRender.current) {
      calendarVisibility();
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
              <TouchableOpacity onPress={() => calendarVisibility()}>
                <DateText>FECHAR</DateText>
              </TouchableOpacity>
            </DateHeader>
          )}
          <StyledDatePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={({ type }: any, date: any) => {
              if (type === "dismissed") {
                return calendarVisibility();
              }
              setDateToInput(date);
              Platform.OS === "android" && calendarVisibility();
            }}
          />
        </Animated.View>
      )}
    </>
  );
}
