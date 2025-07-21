import { baseURL } from "@/utils/axios";
import { FlutterwaveConfig, FlutterWaveProps, FlutterWaveResponse } from "flutterwave-react-v3/dist/types";

type FutterWaveConfigProp = {
   amount: number;
   customer: {
      email: string;
      phone_number: string;
      name: string;
   }
};

const siteUrl = 'https://www.rejah.net/';
// const siteUrl = 'http://localhost:3000/';

const public_key = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ?? '';
console.log("Flutterwave Public Key:", public_key)

const flutterwaveConfig: (props: FutterWaveConfigProp) => FlutterwaveConfig = (props) => ({
   public_key,
   tx_ref: `rejah-tx-${Date.now()}`,
   amount: props.amount,
   currency: "NGN",
   payment_options: "banktransfer,mobilemoney,ussd,card",
   customer: props.customer,
   redirect_url: `${siteUrl}dashboard/tiering/deposit/upload-reciept?amount=${props.amount}`,
   customizations: {
      title: 'Rejah',
      description: "Rejah online payment system",
      // logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
      logo: baseURL+"files/rejah_icon.png",
   },
});

export default flutterwaveConfig

// http://localhost:3000/dashboard/tiering/deposit/upload-reciept&transactionId=rejah-tx-1753081932793&amount=16?status=successful&tx_ref=rejah-tx-1753081932793&transaction_id=1842925632