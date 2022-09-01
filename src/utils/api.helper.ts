import defaultAxios from "axios";
import { AWS_WEBSERVICE_ENDPOINT } from "@env";

export interface ITesouro {
  VALOR_VENDA: string;
  INDEXADOR: string;
  VENCIMENTO: string;
  SELIC: string;
  NOME: string;
  VALOR_COMPRA: string;
  ID: string;
  RENT: string;
}

export const STATUS_INVEST_BASE_URL = "https://statusinvest.com.br/";
export const TESOURO_URL = "tesouro/";
export const ACOES_URL = "acoes/";
export const FII_URL = "fiis/";

/**
 * Instância do axios para chamada de API
 */
const axios = defaultAxios.create({
  baseURL: AWS_WEBSERVICE_ENDPOINT?.toString() || "http://3.87.93.70:8080/",
});

export default axios;
