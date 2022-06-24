import * as React from "react";
import { IAlert } from "../context/Alert/alertContext";

export function networkConnection(
  isConnected: boolean,
  alertContext: React.Dispatch<React.SetStateAction<IAlert>>
) {
  if (!isConnected) {
    alertContext(() => ({
      title: "Falha na conexão com a internet",
      type: "network",
      helperText:
        "Reestabeleça a conexão para prosseguir com os lançamentos e consultas!",
      visibility: true,
    }));
    return false;
  } else {
    return true;
  }
}
