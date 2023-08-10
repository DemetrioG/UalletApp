import { ToastShowParams } from "react-native-toast-message";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

export const handleToast = (params: ToastShowParams) => {
  Toast.show(params);
  if (params.type === "success") return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  if (params.type === "error") return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};
