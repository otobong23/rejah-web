import { createContext, useContext, ReactNode } from 'react';

type userContextType = {
   username: string;
   email: string;
   profilePicture?: string
}

const userContext = createContext<userContextType | null>(null);

export const UserProvider = ({ children, value }: { children: ReactNode, value: userContextType }) => {
   return (
      <userContext.Provider value={value}>
         {children}
      </userContext.Provider>
   )
}

export const useUserContext = () => {
   const context = useContext(userContext);
   if (!context) throw new Error('UserContext does not exist')
   return context;
}