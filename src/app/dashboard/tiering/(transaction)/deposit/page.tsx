"use client";

import { showToast } from "@/utils/alert";
import { Icon } from "@iconify/react";
import copy from "copy-to-clipboard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import cryptoLogo from "@/assets/cryptoLogo.svg";
import { useUserContext } from "@/store/userContext";
import Link from "next/link";
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { FlutterWaveResponse } from "flutterwave-react-v3/dist/types";
import flutterwaveConfig, { NAIRA_RATE } from "@/config/flutterwave";

const NUMBER_LIST = [10, 30, 80, 120, 300, 500, 1000];

const DepositPage = () => {
  const { user } = useUserContext()
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleCopy = (value: string) => {
    copy(value);
    setCopied(true);
    showToast("success", "Copied Successfully");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFlutterPayment = useFlutterwave(flutterwaveConfig({
    amount: Number(amount),
    customer: {
      email: user.email ?? 'guestuser@gmail.com',
      phone_number: String(user.whatsappNo ?? ''),
      name: user.username ?? 'Guest User'
    }
  }));
  const handleCallback = (response: FlutterWaveResponse) => {
    console.dir(response)
    if(response.status === 'successful'){
      showToast('success', 'Payment Processed Successfully')
      console.log(response)
      // sessionStorage.setItem('depositAmount', amount);
      // sessionStorage.setItem('transactionId', String(response.transaction_id));
      // // router.push('/dashboard/tiering/deposit/upload-reciept/')
    }else{
      showToast('error', 'Payment Failed')
    }
    closePaymentModal();
  }
  const handleOnclose = () => {
    showToast('info', "Payment Closed By User")
  }


  const renderAmountInput = () => (
    <>
      <h3 className="text-xs pb-2">Enter Amount</h3>
      <div className="flex gap-2 items-stretch">
        <div className="flex justify-center items-center text-lg py-3.5 px-7 rounded-[15px] border-[#000914] border">USDT</div>
        <input
          type="text"
          placeholder="600,000.00"
          className="py-[15px] px-3 rounded-[15px] border border-[#000914] text-lg font-medium w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <div className="flex gap-3 flex-wrap">
          {NUMBER_LIST.map((number, idx) => (
            <button
              key={idx}
              onClick={() => setAmount(String(number))}
              className="w-[70px] text-sm px-2 py-[7px] border-[#000914] border rounded-[15px] transition-all duration-300"
            >
              {number}
            </button>
          ))}
        </div>
        <button
          onClick={() => setStep(2)}
          disabled={!amount}
          className={`w-full bg-[#0000FF] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${amount ? "opacity-100 hover:scale-90" : "opacity-50 cursor-not-allowed"
            }`}
        >
          Confirm
        </button>
      </div>
    </>
  );

  const renderWalletDetails = () => (
    <>
      <div className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[#0000FF] text-sm text-[#fff] mb-[30px]">
        <p>Total Amount in NGN</p>
        <div className="flex items-center gap-2 justify-center">
          <h1 className="text-2xl font-semibold">{(Number(amount) * NAIRA_RATE).toLocaleString()} NGN </h1>
          <button onClick={() => handleCopy((Number(amount) * NAIRA_RATE).toString())}>
            <Icon icon="akar-icons:copy" className="text-[25px]" />
          </button>
        </div>
        <br />
        <p>Total Amount to Deposit</p>
        <div className="flex items-center gap-2 justify-center">
          <h1 className="text-2xl font-semibold">{((Number(amount) * NAIRA_RATE) + ((0.02 * Number(amount) * NAIRA_RATE))).toLocaleString()} NGN </h1>
          <button onClick={() => handleCopy((Number(amount) * NAIRA_RATE).toString())}>
            <Icon icon="akar-icons:copy" className="text-[25px]" />
          </button>
        </div>
      </div>

      {/* <p className="text-center">An extra charge will be added for the transaction on process</p> */}

      <button
        onClick={() => {handleFlutterPayment({ callback: handleCallback, onClose: handleOnclose })}}
        disabled={!amount}
        className={`w-full bg-[#040439] text-white text-lg font-bold py-[18px] mt-[20px] rounded-[15px] transition ${amount ? "opacity-100 hover:scale-90" : "opacity-50 cursor-not-allowed"
          }`}
      >
        Confirm
      </button>
    </>
  );

  return (
    <div className="text-(--color2)">
      <button
        onClick={() => (step > 1 ? setStep(1) : router.back())}
        className="flex items-center space-x-2 mb-2 cursor-pointer hover:opacity-80 transition-all duration-300"
      >
        <Icon icon="fluent:ios-arrow-24-regular" />
      </button>
      <div className="flex justify-between items-center">
        <h1 className="text-[40px] font-bold mb-8">Deposit</h1>
        <Link href='/dashboard/vault/history'>
          <Icon icon='icon-park-outline:history-query' className="text-(--color2) text-3xl" />
        </Link>
      </div>
      <div className="max-w-[396px] mx-auto">
        {step === 1 ? renderAmountInput() : renderWalletDetails()}
      </div>
    </div>
  );
};

export default DepositPage;
