'use client';
import { Icon } from "@iconify/react/dist/iconify.js";
import whatsappSVG from "@/assets/whatsapp.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HELP_STEPS } from "@/constant/Home";



export default function HelpScreen() {
   const router = useRouter()
  return (
    <div className="text-(--color2) pb-20">
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

      {/* WhatsApp Icon (bottom-right) */}
      <Link href='/' className="fixed bottom-24 right-4">
        <Image
          src={whatsappSVG}
          alt="WhatsApp"
          className="w-24 h-full object-cover rounded-full shadow-lg"
        />
      </Link>
    </div>
  );
}
