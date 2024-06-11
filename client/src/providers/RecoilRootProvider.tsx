"use client";
import React, { useEffect } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { loadingAtom, userAtom } from "@/state-machine/atoms";

const RecoilRootProvider = ({ children }: { children: React.ReactNode }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default RecoilRootProvider;
