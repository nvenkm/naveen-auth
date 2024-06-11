"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Loader, Loader2 } from "lucide-react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
const VerifyPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const api = useAxiosPrivate();

  useEffect(() => {
    async function verify() {
      try {
        setIsLoading(true);
        const res = await api.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/verify`,
          {
            token: token,
          }
        );
        console.log(res);
        if (res.data.success) {
          toast.success(res.data.message);
          router.push("/login");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        }
        router.push("/");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    verify();
  }, []);

  return (
    <div className="flex items-center justify-center mt-10">
      {isLoading ? (
        <div className="flex gap-4 text-xl">
          {" "}
          <Loader2 className="animate-spin" /> Please wait while we verifty your
          account...
        </div>
      ) : (
        <div className="flex gap-4 text-xl">Verified</div>
      )}
    </div>
  );
};

export default VerifyPage;
