import {
  PlatformPay,
  PlatformPayButton,
  confirmPlatformPayPayment,
  isPlatformPaySupported,
} from "@stripe/stripe-react-native";
import { STRIPE_CLIENT_SECRET } from "@env";
import { useEffect, useState } from "react";
import When from "../../When";

export const PaymentScreen = () => {
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);

  useEffect(() => {
    (async function () {
      setIsApplePaySupported(await isPlatformPaySupported());
    })();
  }, [isPlatformPaySupported]);

  async function sendPaymentIntent() {
    return STRIPE_CLIENT_SECRET.toString();
  }

  const pay = async () => {
    const clientSecret = await sendPaymentIntent();

    const { error } = await confirmPlatformPayPayment(clientSecret, {
      applePay: {
        cartItems: [
          {
            label: "Total",
            amount: "1.50",
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
        appearance={PlatformPay.ButtonStyle.Black}
        borderRadius={4}
        style={{
          width: "100%",
          height: 50,
        }}
      />
    </When>
  );
};
