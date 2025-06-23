"use client";

import QRCodeGenerator from "@/components/QRCodeGenerator";
import { showToast } from "@/utils/alert";
import { Icon } from "@iconify/react";
import copy from "copy-to-clipboard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import cryptoLogo from "@/assets/cryptoLogo.svg";
import { useUserContext } from "@/store/userContext";
import Link from "next/link";

const NUMBER_LIST = [10, 30, 80, 120, 300, 500, 1000];

const DepositPage = () => {
  const { user } = useUserContext()
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleCopy = (value: string) => {
    copy(value);
    setCopied(true);
    showToast("success", "Copied Successfully");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceed = () => {
    if (user.ActivateBot) {
      sessionStorage.setItem("depositAmount", amount);
      router.push("/dashboard/tiering/deposit/upload-reciept");
    } else {
      showToast('warning', 'Your account has been suspended. Please Vist Customer Care')
    }
  };

  const renderAmountInput = () => (
    <>
      <h3 className="text-xs pb-2">Enter Amount</h3>
      <div className="flex gap-2 items-stretch">
        <div className="flex justify-center items-center text-lg py-3.5 px-7 rounded-[15px] border-white border">USDT</div>
        <input
          type="text"
          placeholder="600,000.00"
          className="py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full"
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
              className="w-[70px] text-sm px-2 py-[7px] border-white border rounded-[15px] transition-all duration-300"
            >
              {number}
            </button>
          ))}
        </div>
        <button
          onClick={() => setStep(2)}
          disabled={!amount}
          className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${amount ? "opacity-100 hover:scale-90" : "opacity-50 cursor-not-allowed"
            }`}
        >
          Confirm
        </button>
      </div>
    </>
  );

  const renderWalletDetails = () => (
    <>
      <div className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[#002732] text-sm text-[#A8A79E] mb-[30px]">
        <p>Amount to Deposit</p>
        <h1 className="text-2xl text-(--color2) font-semibold">{Number(amount).toLocaleString()} USDT</h1>
        <p>Transfer exact amount of plans</p>
      </div>
      <div className="p-4 bg-white rounded-[15px] w-fit mx-auto mb-[30px]">
        <QRCodeGenerator address={user.depositAddress} />
      </div>

      {subStep === 1 ? (
        <>
          <div className="text-[#A8A79E] text-xs mb-14">
            <p>Wallet Address</p>
            <div className="flex justify-between">
              <h2 className="text-[22px] font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">{user.depositAddress}</h2>
              <button onClick={() => handleCopy(user.depositAddress)}>
                <Icon icon="akar-icons:copy" className="text-[25px] text-(--color2)" />
              </button>
            </div>
            <div className="flex justify-between mt-[30px]">
              <p className="font-semibold">Coin</p>
              <div className="flex items-center gap-3">
                <Image src={cryptoLogo} width={26} alt="crypto logo" />
                <p className="text-[#2E3033]">USDT/TRC20</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSubStep(2)}
            disabled={!amount}
            className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${amount ? "opacity-100 hover:scale-90" : "opacity-50 cursor-not-allowed"
              }`}
          >
            Confirm
          </button>
        </>
      ) : (
        <>
          <div className="text-(--color2) text-sm mb-[50px]">
            <h1 className="text-center text-[40px] font-bold mb-2.5">Confirm</h1>
            <p className="text-center">You've Deposited to wallet address.</p>
            <ul className="list-disc px-3">
              <li className="flex justify-between">
                <span>Amount:</span><span>${amount}</span>
              </li>
              <li className="flex justify-between">
                <span>Initial Balance:</span><span>${user.balance}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleProceed}
            disabled={!amount}
            className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${amount ? "opacity-100 hover:scale-90" : "opacity-50 cursor-not-allowed"
              }`}
          >
            I have Deposited
          </button>
        </>
      )}
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
