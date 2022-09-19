import * as React from "react";
import { VStack } from "native-base";

import { TotalOpen } from "../Positions";
import { DataContext } from "../../context/Data/dataContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { numberToReal } from "../../utils/number.helper";
import { useIsFocused } from "@react-navigation/native";
import {
  getAssets,
  IAsset,
  ITotal,
  refreshAssetData,
} from "../Positions/query";

const InvestSummary = () => {
  const { setData } = React.useContext(DataContext);
  const {
    loader: { equity },
    setLoader,
  } = React.useContext(LoaderContext);
  const [totalValue, setTotalValue] = React.useState(0);
  const [totalRent, setTotalRent] = React.useState(0);

  const isFocused = useIsFocused();

  function setValues({
    assets,
    total: { totalValue, totalRent, equity },
  }: {
    assets: IAsset[];
    total: ITotal;
  }) {
    totalValue && setTotalValue(totalValue);
    totalRent && setTotalRent(totalRent);
    equity &&
      setData((state) => ({
        ...state,
        equity: equity,
      }));
  }

  React.useEffect(() => {
    isFocused &&
      refreshAssetData().finally(() => {
        getAssets()
          .then((data) => {
            setValues(data);
          })
          .finally(() => {
            !equity &&
              setLoader((loaderState) => ({
                ...loaderState,
                equity: true,
              }));
          });
      });
  }, [isFocused]);

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
