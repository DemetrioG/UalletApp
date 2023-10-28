import { Center } from "native-base";
import LoadingAnimation from "../../../assets/icons/blueLoading.json";
import LottieView from "lottie-react-native";

export const Loading = () => {
  return (
    <Center flex={1}>
      <LottieView
        source={LoadingAnimation}
        autoPlay={true}
        loop={true}
        style={{ width: 50 }}
      />
    </Center>
  );
};
