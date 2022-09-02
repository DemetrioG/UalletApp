import firebase from "../../services/firebase";
import { IData } from "../../context/Data/dataContext";
import { getFinalDateMonth } from "../../utils/date.helper";
import { currentUser } from "../../utils/query.helper";

async function _getData(context: IData) {
  const user = await currentUser();
  const { month, year, modality } = context;

  if (!user) return Promise.reject(false);

  if (year !== 0) {
    const initialDate = new Date(`${month}/01/${year} 00:00:00`);
    const finalDate = new Date(
      `${month}/${getFinalDateMonth(month, year)}/${year} 23:59:59`
    );

    let needs = 0;
    let invest = 0;
    let leisure = 0;
    let education = 0;
    let shortAndMediumTime = 0;

    // Busca no banco os dados referente ao Mês atual
    await firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(modality)
      .get()
      .then(async () => {
        await firebase
          .firestore()
          .collection("entry")
          .doc(user.uid)
          .collection(modality)
          .where("type", "==", "Despesa")
          .where("date", ">=", initialDate)
          .where("date", "<=", finalDate)
          .get()
          .then((v) => {
            let total = 0;
            if (v.empty) {
              return Promise.reject("empty");
            } else {
              v.forEach((result) => {
                const segmentData = [result.data()];
                segmentData.forEach(({ segment }) => {
                  switch (segment) {
                    case "Necessidades":
                      needs++;
                      break;

                    case "Investimentos":
                      invest++;
                      break;

                    case "Lazer":
                      leisure++;
                      break;

                    case "Educação":
                      education++;
                      break;

                    case "Curto e médio prazo":
                      shortAndMediumTime++;
                      break;
                  }

                  total++;
                });
              });
            }

            needs = (needs / total) * 100;
            invest = (invest / total) * 100;
            leisure = (leisure / total) * 100;
            education = (education / total) * 100;
            shortAndMediumTime = (shortAndMediumTime / total) * 100;
          });
      })
      .catch((e) => Promise.reject(e));

    return Promise.resolve([
      leisure,
      invest,
      education,
      shortAndMediumTime,
      needs,
    ]);
  }
}

export function getData(context: IData) {
  try {
    return _getData(context);
  } catch (error) {
    throw new Error(error as string);
  }
}
