import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Cacheia os dados
 */
export async function setStorage(
  key: string,
  data: object | number | string | boolean
) {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

/**
 * Retorna um dado específico em cache
 */
export async function getStorage(key: string) {
  const response = (await AsyncStorage.getItem(key)) || null;
  return response ? JSON.parse(response) : null;
}

/**
 * Retorna todos os dados em cache
 */
export async function getAllStorage() {
  return await AsyncStorage.getAllKeys();
}

/**
 * Remove um registro específico em cache
 */
export async function removeStorage(key: string) {
  await AsyncStorage.removeItem(key);
}

/**
 * Remove todos os registros em cache
 */
export async function removeAllStorage() {
  const data = await getAllStorage();
  await AsyncStorage.multiRemove(data);
}
