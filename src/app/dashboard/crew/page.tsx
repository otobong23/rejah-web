import React from 'react'
import { Metadata } from 'next';
import CrewPage from './CrewPage';

export const metadata:Metadata = {
   title: "Crew",
}

const page = () => {
  return (
    <CrewPage />
  )
}

export default page