"use client";
import React, { useEffect, useState } from "react";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { verifyTokenAtom } from "@/state-machine/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { verifyUserService } from "@/state-machine/services/authService";
import axios from "axios";
const VerifyPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [isLoading, setIsLoading] = useState(true);
    // const setVerifyToken = useSetRecoilState(verifyTokenAtom);
    // const tokenService = useRecoilValue(verifyUserService);
    // setVerifyToken(token);

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
            } catch (error) {
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
