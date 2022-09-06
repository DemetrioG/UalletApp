import * as React from "react";
import { VStack } from "native-base";

import { TotalOpen } from "../Positions";
import { DataContext } from "../../context/Data/dataContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { numberToReal } from "../../utils/number.helper";
import { getStorage } from "../../utils/storage.helper";
import { refreshAssetData } from "../Positions/query";

const InvestSummary = () => {
  const { setData } = React.useContext(DataContext);
  const {
    loader: { equity },
    setLoader,
  } = React.useContext(LoaderContext);
  const [totalValue, setTotalValue] = React.useState(0);
  const [totalRent, setTotalRent] = React.useState("0,00");

  async function getData() {
    const totalValue = await getStorage("investPositionsTotalValue");
    const totalRent = await getStorage("investPositionsTotalRent");
    const totalEquity = await getStorage("investTotalEquity");

    totalValue && setTotalValue(totalValue);
    totalRent && setTotalRent(totalRent);
    totalEquity &&
      setData((state) => ({
        ...state,
        equity: totalEquity,
      }));
  }

  React.useEffect(() => {
    refreshAssetData()
      .then(async () => {
        await getData();
      })
      .finally(() => {
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
