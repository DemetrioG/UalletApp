import axios from "axios";
import { load } from "cheerio";
import { AssetSegment } from "../types/types";
import {
  ACOES_URL,
  BDRS_URL,
  CRIPTO_URL,
  ETFS_URL,
  FIAGRO_URL,
  FII_URL,
  STATUS_INVEST_BASE_URL,
} from "./api.helper";

/**
 * Checa se o ativo informado é válido
 * @param value Ticker do ativo
 */
export async function checkAssetValid(value: string, type: AssetSegment) {
  let URL = STATUS_INVEST_BASE_URL;

  switch (type) {
    case "Ações":
      URL += ACOES_URL;
      break;
    case "BDR's":
      URL += BDRS_URL;
      break;
    case "Criptomoedas":
      URL += CRIPTO_URL;
      break;
    case "ETF's":
      URL += ETFS_URL;
      break;
    case "FIIs":
      URL += FII_URL;
      break;
    case "Fiagro":
      URL += FIAGRO_URL;
      break;
  }

  const { data } = await axios.get(URL + value);
  const html = load(data);
  const response = html("main")
    .find('h1:contains("Não encontramos o que você está procurando")')
    .html();

  return response ? false : true;
}
