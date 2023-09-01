import { useEffect, useState } from "react";
import {
  PlatformPay,
  PlatformPayButton,
  confirmPlatformPayPayment,
  isPlatformPaySupported,
} from "@stripe/stripe-react-native";
import { API_URL } from "@env";
import When from "../../When";
import { useGetPrice } from "../../../screens/App/Checkout/hooks/useCheckout";

export const ApplePay = () => {
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const { data } = useGetPrice();

  useEffect(() => {
    (async function () {
      setIsApplePaySupported(await isPlatformPaySupported());
    })();
  }, [isPlatformPaySupported]);

  async function sendPaymentIntent() {
    const response = await fetch(`${API_URL.toString()}/createPaymentIntent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { client_secret } = await response.json();
    return client_secret;
  }

  const pay = async () => {
    const clientSecret = await sendPaymentIntent();

    const { error } = await confirmPlatformPayPayment(clientSecret, {
      applePay: {
        cartItems: [
          {
            label: "Total",
            amount: data.toString(),
            paymentType: PlatformPay.PaymentType.Recurring,
            intervalCount: 1,
            intervalUnit: PlatformPay.IntervalUnit.Month,
          },
        ],
        merchantCountryCode: "BR",
        currencyCode: "BRL",
        requiredShippingAddressFields: [PlatformPay.ContactField.PostalAddress],
        requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
      },
    });
    if (error) {
      console.log(error);
    } else {
      console.log("opa");
    }
  };

  return (
    <When is={isApplePaySupported}>
      <PlatformPayButton
        onPress={pay}
        appearance={PlatformPay.ButtonStyle.WhiteOutline}
        borderRadius={4}
        style={{
          width: "100%",
          height: 50,
        }}
      />
    </When>
  );
};
