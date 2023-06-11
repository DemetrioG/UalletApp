import firebase from "@services/firebase";
import { IData } from "@context/Data/dataContext";
import { getFinalDateMonth } from "@utils/date.helper";
import { currentUser } from "@utils/query.helper";

async function _getData(context: IData) {
  const user = await currentUser();
  const { month, year, modality } = context;

  if (!user) return Promise.reject(false);

  let incomeData = [0, 0, 0];
  let expenseData = [0, 0, 0];

  if (year !== 0) {
    let initialMonth = month - 2;
    let initialYear = year;

    if (initialMonth == -1) {
      initialMonth = 11;
      initialYear -= 1;
    } else if (initialMonth == 0) {
      initialMonth = 12;
      initialYear -= 1;
    }
    const initialDate = new Date(`${initialMonth}/01/${initialYear} 00:00:00`);
    const finalDate = new Date(
      `${month}/${getFinalDateMonth(month, year)}/${year} 23:59:59`
    );

    // Busca no banco os dados referente ao Mês - 2 até Mês atual
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
          .where("date", ">=", initialDate)
          .where("date", "<=", finalDate)
          .get()
          .then((v) => {
            if (v.empty) {
              return Promise.reject("empty");
            } else {
              v.forEach((result) => {
                const storedDate =
                  new Date(result.data().date * 1000).getMonth() + 1;

                let index = 0;

                let firstMonth = month - 2;
                let secondMonth = month - 1;
                const thrirdMonth = month;

                if (firstMonth == -1) {
                  firstMonth = 11;
                } else if (firstMonth == 0) {
                  firstMonth = 12;
                }

                if (secondMonth == -1) {
                  secondMonth = 11;
                } else if (secondMonth == 0) {
                  secondMonth = 12;
                }

                // Faz a separação de cada resultado pelo mês de referência
                switch (storedDate) {
                  case firstMonth:
                    index = 0;
                    break;

                  case secondMonth:
                    index = 1;
                    break;

                  case thrirdMonth:
                    index = 2;
                    break;
                }

                if (result.data().type === "Receita") {
                  incomeData[index] += Math.round(result.data().value);
                } else {
                  expenseData[index] += Math.round(result.data().value);
                }
              });
            }
          });
      })
      .catch((e) => Promise.reject(e));

    return Promise.resolve([incomeData, expenseData]);
  }
}

export function getData(context: IData) {
  try {
    return _getData(context);
  } catch (error) {
    throw new Error(error as string);
  }
}
