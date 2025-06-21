import { Suspense } from 'react';
import Signup from './Signup';
import { Metadata } from 'next';

export const metadata:Metadata = {
   title: "Signup",
}

export default function SignupPage() {
   return (
      <Suspense fallback={<div>Loading signup form...</div>}>
         <Signup />
      </Suspense>
   );
}