import { MMKVStorage } from "../../stores/mmkv-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserState } from "../../helpers/types";
import { USERDATA } from "../../helpers/graphQL/queries";
import client  from "../../utilities/apolloClient";
import { UPDATE_USER } from "../../helpers/graphQL/mutation";

export const useUserStore = create<UserState>()(persist(
    (set, get) => ({
        userData: {},
        getUserData: async (id: string) => {
            const result = await client.query({ query: USERDATA, variables: { id }, fetchPolicy: 'network-only' });
            if (result?.data) {
                set({ userData: result?.data?.usersCollection?.edges[0]?.node });
            }
        },
        setUserData: (input: Object) => {
            set({
                userData: input
            })
        },
        updateUser: async (id: string, input: Object) => {
            try {
                const { data } = await client.mutate({ mutation: UPDATE_USER, variables: { id, input } });
                return data?.updateusersCollection?.records
            } catch (error) {
                console.log(error)
            }

        },
        clearUserData: () => set({ userData: get().userData = [] }),
    }),
    {
        name: '@user-data',
        storage: createJSONStorage(() => MMKVStorage),
    }
));

