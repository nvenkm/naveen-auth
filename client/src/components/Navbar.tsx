"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { loadingAtom, userAtom } from "@/state-machine/atoms";
import { useRecoilState } from "recoil";
import axios from "axios";
import toast from "react-hot-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const Navbar = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const api = useAxiosPrivate();
  async function handleLogout() {
    try {
      setLoading(true);
      setIsLoggingOut(true);
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/logout`
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);

      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
    } finally {
      setLoading(false);
      setIsLoggingOut(false);
    }
  }
  return (
    <nav className=" bg-slate-50 py-4">
      <div className="mx-24 flex items-center text-xl justify-between">
        <Link className="p-3" href="/">
          Auth.naveen
        </Link>
        {loading ? (
          <div></div>
        ) : (
          <div>
            {!user ? (
              <ul className="flex gap-5 items-center ml-14">
                <Button className="bg-white text-black border hover:bg-slate-50">
                  <Link href="/login">Login</Link>
                </Button>
                <Button>
                  <Link href="/register">Register</Link>
                </Button>
              </ul>
            ) : (
              <Button onClick={handleLogout}>Logout</Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
