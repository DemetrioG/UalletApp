import defaultAxios from "axios";
import axios, {
  ACOES_URL,
  FII_URL,
  STATUS_INVEST_BASE_URL,
} from "./api.helper";

/**
 * @param value Ticker do ativo
 */
export async function checkAssetValid(
  value: string,
  type: "Ações" | "FIIs e Fiagro" | "Criptomoedas" | "BDR's"
) {
  const CRIPTO_URL = `${STATUS_INVEST_BASE_URL}criptomoedas/`;
  const BDRS_URL = `${STATUS_INVEST_BASE_URL}bdrs/`;

  if (type === "Ações") {
    return axios
      .get(`${ACOES_URL}${value}/`)
      .then(() => true)
      .catch(() => false);
  }

  if (type === "FIIs e Fiagro") {
    return axios
      .get(`${FII_URL}${value}/`)
      .then(() => true)
      .catch(() => false);
  }

  if (type === "Criptomoedas") {
    return defaultAxios
      .get(`${CRIPTO_URL}${value}/`)
      .then(() => true)
      .catch(() => false);
  }

  /** Não validou */
  if (type === "BDR's") {
    return defaultAxios
      .get(`${BDRS_URL}${value}/`)
      .then(() => true)
      .catch(() => false);
  }
}
