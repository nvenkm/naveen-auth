import { atom } from "recoil";

interface User {
  fullName: string;
  email: string;
  _id: string;
}

export const loadingAtom = atom<boolean>({
  key: "loading",
  default: false,
});

export const verifyTokenAtom = atom<string | null>({
  key: "verifyToken",
  default: null,
});

export const userAtom = atom<User | null>({
  key: "user",
  default: null,
});
