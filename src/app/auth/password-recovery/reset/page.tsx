'use client'
import { showToast } from '@/utils/alert'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const a = 'w-[48px] md:w-[69px] h-[60px] md:h-[85px] bg-none text-[var(--color2)] text-center text-lg lg:text-xl rounded-[15px] lg:rounded-[17px]'
const page = () => {
   const [VCode, setVCode] = useState<number[]>(new Array(4).fill(""));
   const [error, setError] = useState<{ active: boolean, message: string }>({ active: false, message: '' })
   const [active, setActive] = useState(false)
   const [seconds, setSeconds] = useState(3 * 60); // 3 minutes countdown


   const handleChange = (e: any, i: any) => {
      const newError: typeof error = { active: false, message: '' }
      setError(newError)
      if (isNaN(e.target.value)) return false;
      setVCode([
         ...VCode.map((data, indx) => (indx === i ? e.target.value : data)),
      ]);
      if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
      if (!e.target.value && e.target.previousSibling)
         e.target.previousSibling.focus();
   };
   // Handle pasting OTP
   const handlePaste = (e: any) => {
      const pasteData = e.clipboardData.getData('text');
      const pasteValues = pasteData.split('').slice(0, 4);  // Limiting to 4 digits
      if (pasteValues.length === 4 && pasteValues.every((char: any) => !isNaN(char))) {
         setVCode(pasteValues);
      }
   };
   const handleKeyDown = (e: any) => {
      if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
         e.target.previousSibling.focus();
      }
      if (e.key === 'Enter') {
         e.preventDefault();
         handleSubmit(e);
      }
   }

   useEffect(() => {
      if (VCode.filter(e => e).length === 4) {
         setActive(true)
      } else {
         setActive(false)
      }
   })

   useEffect(() => {
      let timer: NodeJS.Timeout;
      if (seconds > 0) {
         timer = setTimeout(() => {
            setSeconds(prev => prev - 1);
         }, 1000);
      }
      return () => clearTimeout(timer);
   }, [seconds]);
   const handleResend = () => {
      setSeconds(3 * 60);
      setVCode(new Array(4).fill(""));
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      const code = VCode.join('')
      try {
         showToast('success', 'Code verified successfully!')
      } catch (err) {
         const errorObj = err as Error;
         const newError: typeof error = { active: true, message: errorObj.message }
         setError(newError)
         showToast('error', 'Code verification failed!')
      }
   }
   return (
      <form onSubmit={handleSubmit} className="p-10 w-full max-w-md text-[var(--color2)]">
         <h1 className="text-[40px] leading-normal font-bold text-[var(--color2)] mb-[10px] text-center">Verify</h1>
         <p className='text-center text-sm mb-10 text-[var(--color2)]'>Input the four digit code in the<br />input field below.</p>

         <div className="code-f flex justify-center items-center gap-2" onPaste={handlePaste}>
            {VCode.map((data, i) => (
               <input
                  title={`OTP_Code_${i}`}
                  key={"input_" + i}
                  type="text"
                  id="N1"
                  value={data}
                  maxLength={1}
                  className={`${a} border-2 outline-[var(--color2)] ${i + 1 <= VCode.filter(e => e).length ? 'border-[var(--color2)] border-4' : 'border-[--color2]/20'}
                  ${error.active
                        ? 'border-[var(--color6)] text-[var(--color6)]'
                        : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                     }
                  `}
                  onInput={(e) => handleChange(e, i)}
                  onKeyDown={e => handleKeyDown(e)}
                  onFocus={(e) => e.target.select()}
               />
            ))}
         </div>
         {error.active && (
            <p className="text-sm mt-1 text-[#D54244]">{error.message}</p>
         )}

         <div className="flex justify-center mt-10">
            {seconds > 0 ? <p className='text-[var(--color2)] text-sm flex gap-[2px]'>Resending in {seconds > 0 ? `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60}` : '00:00'}
               <span className='w-5 h-5 border border-r-transparent border-[var(--color2)] rounded-full flex items-center justify-center animate-spin'>
                  <span className='w-3 h-3 block border border-l-transparent border-[var(--color2)] rounded-full animate-spin'></span>
               </span>
            </p> : <Link href="#" onClick={handleResend} className='text-[var(--color2)] text-sm'>Resend code</Link>}
         </div>

         <button
            type="submit"
            className={`w-full bg-[#6EBA0E] text-white text-lg font-bold mt-12 py-[18px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`} disabled={!active}
         >
            Verify code
         </button>
      </form>
   )
}

export default page