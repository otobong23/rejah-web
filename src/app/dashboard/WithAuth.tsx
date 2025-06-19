"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLoader } from "@/store/LoaderContext";
import { useUserContext } from "@/store/userContext";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const {user, setUser} = useUserContext()
  const { showPageLoader, hidePageLoader, PageLoader } = useLoader()
  const router = useRouter();

  useEffect(() => {
    showPageLoader()
    const getUser = async () => {
      const userToken = Cookies.get("userToken");

      if (!userToken) {
        router.replace("/auth/login");
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        const response = await api.get<UserType>("/profile/");
        setUser(response.data);
        hidePageLoader()
      } catch (error) {
        hidePageLoader()
        console.error("Error fetching user profile:", error);
        router.replace("/auth/login");
      }
    };

    getUser();
  }, [router]);

  if (PageLoader || !user) {
    return null; // or return a spinner/loading UI
  }

  return (
    <>
      {children}
    </>
  );
};

export default WithAuth;
