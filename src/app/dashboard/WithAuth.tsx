"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { UserProvider } from "@/store/userContext";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    username: string;
    email: string;
    profilePicture?: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const userToken = Cookies.get("userToken");

      if (!userToken) {
        router.replace("/auth/login");
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        const response = await api.get("/profile/");
        const { username, email, profilePicture } = response.data;

        setUser({ username, email, profilePicture });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.replace("/auth/login");
      }
    };

    getUser();
  }, [router]);

  if (isLoading || !user) {
    return null; // or return a spinner/loading UI
  }

  return (
    <UserProvider
      value={{
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      }}
    >
      {children}
    </UserProvider>
  );
};

export default WithAuth;
