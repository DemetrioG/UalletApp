import { numberToReal } from ".";

/**
 * @param firebase   firebase connection
 * @param props      Redux props
 * @param setBalance Hook balance state
 * @returns          Saldo atual
 */

// Busca as informações de Saldo no banco

export default async function getBalance(firebase, props, setBalance) {
    await firebase.firestore().collection('balance').doc(props.uid).collection(props.modality).doc(props.month.toString()).onSnapshot((snapshot) => {
        if (snapshot.data()) {
            setBalance(numberToReal(snapshot.data().balance));
        } else {
            setBalance('R$ 0,00');
        }
    })
}