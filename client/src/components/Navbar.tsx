"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { loadingAtom, userAtom } from "@/state-machine/atoms";
import { useRecoilState } from "recoil";

const Navbar = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading] = useRecoilState(loadingAtom);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  console.log("User in navbar:", user);
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
