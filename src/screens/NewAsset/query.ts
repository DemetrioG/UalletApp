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

async function _registerAsset(props: IAsset) {
    const { entrydate, segment, broker, asset, amount, price, total, uid } = props;

    let id = 1;
    // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
    const response = await firebase
    .firestore()
    .collection("assets")
    .doc(uid)
    .collection('Real')
    .orderBy("id", "desc")
    .limit(1)
    .get()

    response.forEach((result) => {
        id += result.data().id;  
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

    return firebase
    .firestore()
    .collection('assets')
    .doc(uid)
    .collection('Real')
    .doc(id.toString())
    .set(items)
}

export function registerAsset(props: IAsset) {
    try {
        return _registerAsset(props);
    } catch (error) {
        throw new Error('Erro')
    }
}