import {AuthenticateType, UserType} from "@/shared/api";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware"



export interface UserStoreState{
    user: UserType | undefined,
    token: string | undefined,
    isAuthorized: boolean,
    authorize: (authInfo: AuthenticateType) => void,
    unAuthorize: () => void,
}
const localStorage = typeof window !== "undefined" ? window.localStorage : undefined;

// let initialToken: string | undefined = undefined;
//
// if (typeof window !== "undefined") {
//   const raw = window.localStorage.getItem("user-storage");
//   if (raw) {
//     try {
//       const parsed = JSON.parse(raw);
//       initialToken = parsed?.state?.token;
//     } catch {}
//   }
// }
//
// const isAuthorized = !!initialToken

export const useUserStore = create<UserStoreState>()(
    persist(
        (set) =>({
            token: undefined,
            user: undefined,
            isAuthorized: false,
            authorize: (authInfo) => {
                set(() => ({
                    token: authInfo.accessToken,
                    user: authInfo.user,
                    isAuthorized: true
                }));
                console.log("authorized!!!!!")
            },
            unAuthorize: () => {
                set(() => ({
                    isAuthorized: false,
                    token: undefined,
                    user: undefined
                }));
            },
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => localStorage as Storage),
        }
    )
)



