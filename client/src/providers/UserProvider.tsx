"use client";
import { loadingAtom, userAtom } from "@/state-machine/atoms";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import jwt from "jsonwebtoken";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      router.push("/login");
      return;
    }
    const data = jwt.decode(token);
    if (!data || typeof data === "string") {
      setLoading(false);
      router.push("/login");
      return;
    }
    const user = data.payload;
    if (!user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    setUser(user);
    setLoading(false);
  }, []);
  return <>{children}</>;
};

export default UserProvider;
