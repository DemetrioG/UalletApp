import * as Device from "expo-device";

const IPHONE_WITH_NOTE = ["X", "11", "12", "13"];

export const IPHONE_BOTTOM_TAB =
  IPHONE_WITH_NOTE.filter((model) =>
    model.includes(Device.modelName?.replace("iPhone ", "")!)
  ).length > 0;
