import firebase from "../../services/firebase";
import { IForm } from ".";
import { currentUser } from "../../utils/query.helper";
import { IEntryList } from "../Entry";
import { convertDateToDatabase } from "../../utils/date.helper";
import { realToNumber } from "../../utils/number.helper";

async function _registerNewEntry(props: IForm) {
    const user = await currentUser();

    if(!user) return Promise.reject();

        const { description, entrydate, value } = props
        let id = 1;
    
          /**
           * Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
            */ 
          await firebase
            .firestore()
            .collection("entry")
            .doc(user.uid)
            .collection(modality)
            .orderBy("id", "desc")
            .limit(1)
            .get()
            .then((v) => {
              v.forEach((result) => {
                id += result.data().id;
              });
            });
    
        const items: IEntryList & {
          consolidated?: { consolidated: boolean; wasActionShown: boolean };
        } = {
          id: id,
          date: convertDateToDatabase(entrydate),
          type: type,
          description: description,
          modality: modality!,
          segment: segment,
          value: realToNumber(value),
        };
    
        if (modality === "Projetado") {
          items["consolidated"] = {
            consolidated: false,
            wasActionShown: false,
          };
        }
    
        /**
         * Esta query é setada, pois caso contrário, o firebase criar a coleção como virtualizada, sendo assim, não é possível ter acesso à ela.
         */
        await firebase
          .firestore()
          .collection("entry")
          .doc(user.uid)
          .set({ created: true });
    
        /**
         *  Registra o novo lançamento no banco
         */ 
        await firebase
          .firestore()
          .collection("entry")
          .doc(user.uid)
          .collection(modality!)
          .doc(id.toString())
          .set(items)
    
        /**
         * Atualiza o saldo atual no banco
         */
        let balance = 0;
        await firebase
          .firestore()
          .collection("balance")
          .doc(user.uid)
          .collection(modality!)
          .doc(Number(entrydate.slice(3, 5)).toString())
          .get()
          .then((v) => {
            balance = v.data()?.balance || 0;
          });
    
          if (type == "Receita") {
            balance += realToNumber(value);
          } else {
            balance -= realToNumber(value);
          }
    
        /**
         * Esta query é setada, pois caso contrário, o firebase criar a coleção como virtualizada, sendo assim, não é possível ter acesso à ela.
         */
        await firebase
          .firestore()
          .collection("balance")
          .doc(user.uid)
          .set({ created: true });
    
        await firebase
          .firestore()
          .collection("balance")
          .doc(user.uid)
          .collection(modality!)
          .doc(Number(entrydate?.slice(3, 5)).toString())
          .set({
            balance: balance,
          })
      }
}

export function registerNewEntry(props: IForm) {
  try {
    return _registerNewEntry(props);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao cadastrar lançamento");
  }
}
