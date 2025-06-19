"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLoader } from "@/store/LoaderContext";
import { AxiosError } from "axios";
import { showToast } from "@/utils/alert";
import { useAdminContext } from "@/store/adminContext";

const AdminAuth = ({ children }: { children: React.ReactNode }) => {
   const { showPageLoader, hidePageLoader, PageLoader } = useLoader()
   const router = useRouter();
   const {admin, setAdmin} = useAdminContext()

   useEffect(() => {
      showPageLoader()
      const getUser = async () => {
         const adminToken = Cookies.get("adminToken");

         if (!adminToken) {
            router.replace("/admin/auth/login");
            return;
         }

         try {
            api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
            const response = await api.get<adminType>("/admin/getAdmin/");
            setAdmin(response.data);
            hidePageLoader()
         } catch (err) {
            hidePageLoader()
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred')
            }
            router.replace("/admin/auth/login");
         }
      };

      getUser();
   }, [router]);

   if (PageLoader || !admin) {
      return null; // or return a spinner/loading UI
   }
   return (
      <>{children}</>
   )
}

export default AdminAuth