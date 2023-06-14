import * as React from "react";
import { VStack } from "native-base";

import firebase from "@services/firebase";
import { TotalOpen } from "../Positions/components";
import { DataContext } from "../../context/Data/dataContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { numberToReal } from "@utils/number.helper";
import { ITotal, refreshAssetData } from "../Positions/query";
import { currentUser } from "@utils/query.helper";

const InvestSummary = () => {
  const { setData } = React.useContext(DataContext);
  const {
    loader: { equity },
    setLoader,
  } = React.useContext(LoaderContext);
  const [totalData, setTotalData] = React.useState<ITotal | null>(null);
  const totalValue = totalData?.totalValue || 0;
  const totalRent = totalData?.totalRent || 0;

  async function getAssets() {
    const user = await currentUser();

    if (!user) return Promise.reject();

    firebase
      .firestore()
      .collection("equity")
      .doc(user.uid)
      .onSnapshot(
        (v) => {
          const data = v.data() as ITotal;
          setTotalData(data);
          setData((state) => ({
            ...state,
            equity: data.equity,
          }));
        },
        () => Promise.reject()
      );

    firebase
      .firestore()
      .collection("prices")
      .doc("_DATA_REFRESHED")
      .onSnapshot((v) => {
        refreshAssetData();
      });
  }

  React.useEffect(() => {
    getAssets().finally(() => {
      !equity &&
        setLoader((loaderState) => ({
          ...loaderState,
          equity: true,
        }));
    });
  }, []);

  return (
    <>
      {equity && (
        <VStack>
          <TotalOpen
            percentual={totalRent}
            value={numberToReal(totalValue)}
            withoutLabel
          />
        </VStack>
      )}
    </>
  );
};

export default InvestSummary;
