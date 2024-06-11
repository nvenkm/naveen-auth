"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
const VerifyPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      try {
        setIsLoading(true);
        const res = await axios.post(
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
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    verify();
  }, []);

  return <div>{isLoading ? <div>Loading...</div> : <div>Verified</div>}</div>;
};

export default VerifyPage;
