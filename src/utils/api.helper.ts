import defaultAxios from 'axios';
import { AWS_WEBSERVICE_ENDPOINT } from '@env';

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

export const TESOURO_URL = 'tesouro/';

const axios = defaultAxios.create({
    baseURL: AWS_WEBSERVICE_ENDPOINT.toString()
});

export default axios;