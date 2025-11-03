'use client';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const page = () => {
   const router = useRouter()
   const searchParams = useSearchParams();
   const refCode = searchParams.get('inviteCode');
   useEffect(() => {
      router.replace(`/auth/signup?inviteCode=${refCode}`)
   })
   return null
}

export default page