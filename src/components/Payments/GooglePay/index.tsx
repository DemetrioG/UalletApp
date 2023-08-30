import { STRIPE_CLIENT_SECRET } from "@env";
import {
  PlatformPay,
  PlatformPayButton,
  confirmPlatformPayPayment,
  isPlatformPaySupported,
} from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import When from "../../When";

export const GooglePay = () => {
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);

  useEffect(() => {
    (async function () {
      setIsGooglePaySupported(
        await isPlatformPaySupported({ googlePay: { testEnv: true } })
      );
    })();
  }, [isPlatformPaySupported]);

  async function sendPaymentIntent() {
    return STRIPE_CLIENT_SECRET.toString();
  }

  const pay = async () => {
    const clientSecret = await sendPaymentIntent();

    const { error } = await confirmPlatformPayPayment(clientSecret, {
      googlePay: {
        testEnv: true,
        merchantName: "Uallet",
        merchantCountryCode: "BR",
        currencyCode: "BRL",
        billingAddressConfig: {
          format: PlatformPay.BillingAddressFormat.Full,
          isPhoneNumberRequired: true,
          isRequired: true,
        },
      },
    });
    if (error) {
      console.log(error);
    } else {
      console.log("opa");
    }
  };

  return (
    <When is={isGooglePaySupported}>
      <PlatformPayButton
        type={PlatformPay.ButtonType.Pay}
        onPress={pay}
        style={{
          width: "100%",
          height: 50,
        }}
      />
    </When>
  );
};
