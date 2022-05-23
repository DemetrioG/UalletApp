import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setStorage(
  key: string,
  data: object | number | string | boolean
) {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function getStorage(key: string) {
  const response = (await AsyncStorage.getItem(key)) || "";
  return JSON.parse(response);
}

export async function removeStorage(key: string) {
  await AsyncStorage.removeItem(key);
}
