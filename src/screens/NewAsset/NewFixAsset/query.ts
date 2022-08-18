import firebase from '../../../services/firebase';
import { convertDateToDatabase } from '../../../utils/date.helper';
import { percentualToNumber, realToNumber } from '../../../utils/number.helper';

export interface IAsset {
    entrydate: string,
    title: string | null,
    cdbname: string | null,
    broker: string | null,
    rent: string,
    rentType: string | null,
    duedate: string | null,
    price: string,
    uid: string,
}

async function _registerAsset(props: IAsset) {
    const { entrydate, broker, duedate, price, rent, title , uid, cdbname, rentType } = props;

    let id = 1;
    // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
    const response = await firebase
    .firestore()
    .collection("assets")
    .doc(uid)
    .collection('fixed')
    .orderBy("id", "desc")
    .limit(1)
    .get()

    response.forEach((result) => {    
        id += result.data().id;  
    });

    const items = {
        id: id,
        date: convertDateToDatabase(entrydate),
        title: title,
        cdbname: cdbname && cdbname.toUpperCase(),
        broker: broker,
        rent: percentualToNumber(rent),
        rentType: rentType?.toUpperCase(),
        duedate: duedate && convertDateToDatabase(duedate),
        price: realToNumber(price)
    }

    return firebase
    .firestore()
    .collection('assets')
    .doc(uid)
    .collection('fixed')
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