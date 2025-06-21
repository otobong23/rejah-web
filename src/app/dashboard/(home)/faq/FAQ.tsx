'use client';
import { FAQ_LIST } from "@/constant/Home";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { useState } from "react";


const FAQ = () => {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="text-(--color2) pb-20">
      {/* Header */}
      <button onClick={() => router.back()} className="flex items-center space-x-2 mb-4 cursor-pointer hover:opacity-80 transition-all duration-300">
        <Icon icon='fluent:ios-arrow-24-regular' className="" />
        <span className="text-lg">back</span>
      </button>
      <div className="flex items-center space-x-2 mb-4">
        <Icon icon='mdi:chat-question' className="text-5xl" />
        <h1 className="text-[40px] font-bold">FAQ</h1>
      </div>

      {/* Subheading */}
      <p className="text-sm mb-6">
        Got any questions | Know <span className="font-semibold">How it works</span> with this guide.
      </p>

      {/* FAQ List */}
      <div className="space-y-3 max-w-[649px] mx-auto">
        {FAQ_LIST.map((faq, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              openIndex === index && faq.answer
                ? "bg-(--color2) text-(--color4) border-(--color2)"
                : "border-(--color2)/30 text-(--color2)"
            }`}
            onClick={() => setOpenIndex(index)}
          >
            <div className="flex items-center justify-between cursor-pointer">
               <p className="font-semibold">{faq.question}</p>
               <Icon icon={openIndex === index && faq.answer ? 'mdi:chevron-up' : 'mdi:chevron-right'} className="text-3xl" />
            </div>
            {openIndex === index && faq.answer && (
              <p className="text-sm mt-1">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ