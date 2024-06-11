"use client";

import Graphs from "@/components/Graphs";
import { loadingAtom, userAtom } from "@/state-machine/atoms";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function Home() {
  const [user] = useRecoilState(userAtom);
  const [loading] = useRecoilState(loadingAtom);
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center p-24">
        <Loader2 width={40} height={40} className="text-3xl animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-between ">
      {user ? (
        <>
          <div>
            <p className="m-5 text-4xl font-extrabold">Hi, {user.fullName}</p>
          </div>
          <div>
            <Graphs />
          </div>
        </>
      ) : (
        <div>
          {/* Render nothing or a placeholder until user state is resolved */}
        </div>
      )}
    </main>
  );
}
