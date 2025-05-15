'use client';
import { useState } from "react";
import Image from "next/image";
import home1 from './images/home1.svg'
import home2 from './images/home2.svg'
import home3 from './images/home3.svg'
import { Icon } from "@iconify/react/dist/iconify.js";
import CAC_Footer from "./components/CAC_Footer";
import CAC_Header from "./components/CAC_Header";
import { useRouter } from 'next/navigation';

// style={{ backgroundImage: `url(${heroImage.src})` }}

// REJAH || 7839534

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query === "REJAH" || query === "7839534"){
      router.push("/cac/search");
    }
  }
  return (
    <main className="font-sans">
      {/* Header */}
      <CAC_Header />

      {/* Hero Section */}
      <section className={`cac-hero relative z-10 bg-[#00ad56] text-white text-center px-[15px] py-24 bg-cover bg-center h-[500px]`}>
        <div className="absolute w-full h-full inset-0 bg-[#000000d2] hidden md:block"></div>
        <h1 className="text-2xl my-[50px] relative z-[999]">Search the Record</h1>
        <div className="max-w-xl mx-auto flex shadow-lg relative z-[999]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search here"
            className="w-full px-4 py-3 rounded-l-md focus:outline-none text-[#333] bg-white"
          />
          <button className="bg-[#74d1c6] md:bg-[#00ad56] px-4 lg:px-6 rounded-r-md text-white font-medium" onClick={handleSearch}>
            <span className="hidden lg:inline">Search</span>
            <Icon icon="mingcute:search-line" className="lg:hidden -rotate-y-180" width={30} height={30} />
          </button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-[#f5f8fa]">
        <div className="text-center lg:mx-[150px] px-[15px] pt-[120px] pb-[95px]">
          <h2 className="text-3xl font-light mb-12">
            DISCOVER THE <span className="font-semibold">ONLINE</span> SEARCH!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-[25px] max-w-6xl mx-auto">
            {[
              {
                title: <span>LOCATE <br /> COMPANY ADDRESS</span>,
                icon: home1,
              },
              {
                title: <span>FOLLOW <br /> COMPANY</span>,
                icon: home2,
              },
              {
                title: <span>VIEW <br /> COMPANY DATA</span>,
                icon: home3,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white shadow-xl rounded px-[45px] py-10 flex flex-col items-center text-center relative"
              >
                <Image src={item.icon} alt={''} width={120} height={120} />
                <p className="mt-6 font-semibold text-green-700">
                  {item.title}
                </p>
                <div className="flex justify-center items-center w-[70px] h-[70px] border-2 border-[#ededed] z-10 bg-white rounded-full absolute top-full -mt-5 lg:top-1/2 lg:left-full lg:transform lg:-translate-x-6 lg:-mt-[45px]" hidden={idx === 2}>
                  <Icon icon="bitcoin-icons:arrow-down-filled" className="text-[#A3D4FF] lg:transform lg:-rotate-90" width="30" height="30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <CAC_Footer />
    </main>
  );
}
