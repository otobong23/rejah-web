import { Suspense } from 'react';
import Signup from './Signup';

export default function SignupPage() {
   return (
      <Suspense fallback={<div>Loading signup form...</div>}>
         <Signup />
      </Suspense>
   );
}