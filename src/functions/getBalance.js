import { numberToReal } from ".";

/**
 * @param firebase firebase connection
 * @param props Redux props
 * @param setBalance Hook balance state
 */

// Busca as informações de Saldo no banco

export default async function getBalance(firebase, props, setBalance) {
            
    await firebase.firestore().collection('balance').doc(props.uid).collection(props.modality).doc('balance').onSnapshot((snapshot) => {
        if (snapshot.data()) {
            setBalance(numberToReal(snapshot.data().balance));
        } else {
            setBalance('R$ 0,00');
        }
    })
}