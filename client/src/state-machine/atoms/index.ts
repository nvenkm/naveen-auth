import { atom } from "recoil";

export const loadingAtom = atom<boolean>({
    key: "loading",
    default: false,
});

export const verifyTokenAtom = atom<string | null>({
    key: "verifyToken",
    default: null,
});
