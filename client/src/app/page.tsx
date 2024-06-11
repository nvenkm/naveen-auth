"use client";

import { loadingAtom, userAtom } from "@/state-machine/atoms";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRecoilState } from "recoil";

export default function Home() {
  const [user] = useRecoilState(userAtom);
  const [loading] = useRecoilState(loadingAtom);

  console.log("User from homepage:", user);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      {loading ? (
        <div>
          <Loader2 width={40} height={40} className="text-3xl animate-spin" />
        </div>
      ) : (
        <p>Hi, {user?.fullName}</p>
      )}
    </main>
  );
}
