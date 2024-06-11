import { selector } from "recoil";
import { loadingAtom, verifyTokenAtom } from "../atoms";
import axios from "axios";

export const verifyUserService = selector({
    key: "CurrentUserName",
    get: async ({ get }) => {
        try {
            const token = get(verifyTokenAtom);

            const res = await axios.post(
                `${process.env.BACKEND_API_URL}/user/verify`,
                {
                    token,
                }
            );

            console.log("RESPONSE OF VERIFY URL:", res);
        } catch (error) {
        } finally {
        }
    },
});
