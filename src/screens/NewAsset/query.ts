import firebase from '../../services/firebase';
import { convertDateToDatabase } from '../../utils/date.helper';
import { realToNumber } from '../../utils/number.helper';

export interface IAsset {
    entrydate: string;
    segment: string | null;
    broker: string | null;
    asset: string;
    amount: number;
    price: string;
    total: string;
    uid: string;
  }

export function registerAsset({entrydate, segment, broker, asset, amount, price, total, uid}: IAsset) {
    return new Promise( async (resolve, reject) => {
        try {
            let id = 1;
            // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
            await firebase
            .firestore()
            .collection("assets")
            .doc(uid)
            .collection('Real')
            .orderBy("id", "desc")
            .limit(1)
            .get()
            .then((v) => {
                v.forEach((result) => {
                    id += result.data().id;  
                });
            }).catch(() => {
                throw new Error('Erro ao retornar último ID')
            });

            const items = {
                id: id,
                date: convertDateToDatabase(entrydate),
                segment: segment,
                broker: broker,
                asset: asset.toUpperCase(),
                amount: amount,
                price: realToNumber(price),
                total: realToNumber(total)
            }

            firebase
            .firestore()
            .collection('assets')
            .doc(uid)
            .collection('Real')
            .doc(id.toString())
            .set(items)
            .catch(() => {
                throw new Error('Erro ao salvar o ativo')
            })
            
            resolve('success')
        } catch (e) {
            reject(e)
        }
    })
}