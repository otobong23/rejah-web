'use client';
import { useState } from "react";
import CAC_Footer from "../components/CAC_Footer";
import CAC_Header from "../components/CAC_Header";

export default function SearchResults() {
   const [query, setQuery] = useState("REJAH");

   return (
      <div>
         {/* Header */}
         <CAC_Header />
         <main className="font-sans bg-[#f5f8fa]">
            {/* Search Bar */}
            <div className="bg-[#00ad56] flex flex-col md:flex-row md:items-center md:justify-end lg:px-[150px] py-[10px]">
               <div className="px-[15px] flex flex-row">
                  <input
                     type="text"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="Search here"
                     className="w-full md:w-[400px] px-4 py-2 rounded-bl rounded-tl md:rounded-l-md border border-gray-300 focus:outline-none bg-white"
                  />
                  <button className="bg-[#33bd78] text-white px-[15px] py-[9px] rounded-br rounded-tr md:rounded-r-md">
                     Search
                  </button>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:mx-[150px] p-[15px] items-stretch gap-1.5 lg:gap-20 pt-[15px]">
               {/* Filter Tabs */}
               <div>
                  <label className="text-xs text-[#999] hidden lg:block">Type</label>
                  <div className="flex flex-wrap text-sm">

                     {[
                        "BUSINESS NAME",
                        "COMPANY",
                        "INCORPORATED TRUSTEES",
                        "LIMITED PARTNERSHIP",
                        "LIMITED LIABILITY PARTNERSHIP",
                     ].map((label) => (
                        <button
                           key={label}
                           className="px-2 py-2 bg-white border-[0.1px] border-[#00000032] text-green-700 hover:bg-green-100 text-xs"
                        >
                           {label}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Sort Dropdown */}
               <div className="flex flex-col items-start">
                  <label className="text-xs text-[#999] hidden lg:block">Sort by</label>
                  <select className="border">
                     <option>-- Sort By --</option>
                  </select>
               </div>
            </div>

            <div className="bg-[#00000039] h-[0.2px] w-full my-[15px]" />


            <div className="mx-[150px] p-[15px] pt-[60px] pb-[35px]">
               {/* Search Result Card */}
               <div className="bg-white shadow-md rounded py-6 mb-[25px]">
                  <h2 className="text-green-700 text-xl font-semibold mb-1 px-6">
                     REJAH
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 px-6">BN - 7839534</p>

                  <div className="bg-[#00000039] h-[0.2px] w-full my-[15px]" />

                  <div className="flex flex-col sm:flex-row gap-2 text-sm px-6">
                     <div className="flex items-center gap-2">
                        <span className="font-semibold">Status:</span>
                        <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                           ACTIVE
                        </span>
                     </div>
                     <span className="hidden sm:inline">|</span>
                     <div>
                        <span className="font-semibold">Date of Registration - </span>May 15, 2025
                     </div>
                  </div>
               </div>
               {/* Pagination */}
               <div className="flex justify-start mt-5">
                  <div className="inline-flex gap-1">
                     <button className="px-2 py-1 border rounded text-sm">««</button>
                     <button className="px-2 py-1 border rounded text-sm">«</button>
                     <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                     <button className="px-2 py-1 border rounded text-sm">»</button>
                     <button className="px-2 py-1 border rounded text-sm">»»</button>
                  </div>
               </div>
            </div>


         </main>

         {/* Footer */}
         <CAC_Footer />
      </div>
   );
}
