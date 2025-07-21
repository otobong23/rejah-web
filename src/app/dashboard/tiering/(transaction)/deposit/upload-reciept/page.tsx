import { Suspense } from "react"
import UploadPage from "./UploadPage"

const page = () => {
   return (
      <Suspense fallback={<div>Loading Upload Page form...</div>}>
         <UploadPage />
      </Suspense>
   )
}

export default page