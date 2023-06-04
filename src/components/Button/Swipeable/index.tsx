import SwipeButton, { Props } from "rn-swipe-button";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronsRight } from "lucide-react-native";
import { colors } from "../../../styles";

const Icon = () => {
  return <ChevronsRight color={colors.strongBlue} />;
};

const Swipeable = (props: ISwipeableProps) => {
  const { title, ...restProps } = props;
  return (
    <>
      <SwipeButton
        disabled={false}
        title={title}
        width="100%"
        shouldResetAfterSuccess
        railBackgroundColor="transparent"
        thumbIconBorderColor="white"
        thumbIconBackgroundColor="white"
        // @ts-expect-error
        thumbIconComponent={Icon}
        containerStyles={{
          padding: 8,
          zIndex: 1,
          borderWidth: 0,
        }}
        railStyles={{
          backgroundColor: "rgba(255, 255, 255, .5)",
          borderWidth: 0,
        }}
        thumbIconStyles={{
          shadowColor: "black",
          shadowOffset: { width: 10, height: 10 },
          shadowOpacity: 1,
          shadowRadius: 3,
        }}
        titleStyles={{
          fontFamily: "Montserrat-Regular",
          color: "white",
        }}
        {...restProps}
      />
      <LinearGradient
        colors={["rgb(38, 109, 211)", "rgba(38, 109, 211, 0.3)"]}
        style={{
          width: "100%",
          height: 70,
          position: "absolute",
          zIndex: 0,
          top: 1,
          left: 5,
          borderRadius: 50,
        }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      />
    </>
  );
};

export default Swipeable;

interface ISwipeableProps extends Props {
  title: string;
}
