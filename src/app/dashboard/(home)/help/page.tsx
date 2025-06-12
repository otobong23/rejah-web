'use client';
import { Icon } from "@iconify/react/dist/iconify.js";
import whatsappSVG from "@/assets/whatsapp.svg";
import telegramSVG from "@/assets/telegram.svg"
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HELP_STEPS } from "@/constant/Home";



export default function HelpScreen() {
   const router = useRouter()
  return (
    <div className="text-(--color2) pb-32 relative">
      {/* Header */}
      <button onClick={() => router.back()} className="flex items-center space-x-2 mb-4 cursor-pointer hover:opacity-80 transition-all duration-300">
        <Icon icon='fluent:ios-arrow-24-regular' className="" />
        <span className="text-lg">back</span>
      </button>
      <div className="flex items-center space-x-2 mb-4">
        <Icon icon='ix:about-filled' className="text-5xl" />
        <h1 className="text-[40px] font-bold">Help</h1>
      </div>

      {/* Subheading */}
      <p className="text-sm mb-6">
        Got any questions | Know <span className="font-semibold">How it works</span> with this guide.
      </p>

      {/* Help Steps */}
      <ol className="space-y-4 text-sm max-w-[649px] mx-auto">
         {HELP_STEPS.map((step, index) => (
            <li key={index} className="flex items-start space-x-2">
               <span className="font-semibold text-lg">{index + 1}.</span>
               <span>{step}</span>
            </li>
         ))}
      </ol>

      {/* social media Icon (bottom-right) */}
      <Link href='https://wa.me/447447247209' target="_blank" className="fixed bottom-40 right-4">
        <Image
          src={whatsappSVG}
          alt="WhatsApp"
          className="w-24 h-full object-cover rounded-full shadow-lg"
        />
      </Link>
      <Link href='https://t.me/+kWTXS1QL1qlkZTQ0' target="_blank" className="fixed bottom-20 right-4">
        <Image
          src={telegramSVG}
          alt="telegram"
          className="w-24 h-full object-cover rounded-full shadow-lg"
        />
      </Link>
    </div>
  );
}
