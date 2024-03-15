import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKVStorage } from "../mmkv-storage";

import { 
    GET_BENEFITCLASSBYID, 
    GET_SAVINGS_FREQUENCY, 
    GET_SAVINGS_MODE, 
    INTERESTRATE, 
    SAVINGSTYPE
} from "../../helpers/graphQL/queries";
import { 
    ADD_SAVINGS, 
    UPDATE_THRIFTSAVINGS 
} from "../../helpers/graphQL/mutation";
import client from "../../utilities/apolloClient";
import { supabase } from "../../utilities/supabase";

interface iSavingsStore {
    benefitSavingsClass: any[];
    savingsType: any;
    savingsFrequency: any;
    interestRate: any;
    savingsMode: any;
    updateBalance: (balance: string, userId: string) => Promise<{ updated: boolean; }>;
    getSavingsType: (type: string) => Promise<void>;
    getInterestRate: (name: string) => Promise<void>;
    getSavingsFrequency: () => void;
    addFixedDeposit: (input: Object) => Promise<void>;
    addThriftSavings: (input: Object) => Promise<void>;
    addTargetSavings: (input: Object) => Promise<void>;
    updateThriftSavings: (id: number, input: Object) => Promise<void>;
    addBenefitSavings: (input: Object) => Promise<boolean>;
    addSmartKiddiesSavings: (input: Object) => Promise<boolean>;
    getBenefitSavingsClassById: (savings_type_id: number) => void;
    getSavingsMode: () => void;
}

/**
 * A zustand store for savings-related data.
 */
export const useSavingsStore = create<iSavingsStore>()(persist((set) => ({
    savingsType: {},
    interestRate: {},
    benefitSavingsClass: [],
    savingsFrequency: {},
    savingsMode: [],
    updateBalance: async (balance, userId) => {
        const { data, error } = await supabase
            .from('users')
            .update({ wallet_balance: balance })
            .eq('id', userId)
            .select()
        if (data) {
            return {
                updated: true,
            }
        } else if (error) {
            return {
                updated: false,
            }
        } else {
            throw new Error('An error occured with the update')
        }
    },
    getSavingsType: async (type: string) => {
        const { data } = await client.query({ query: SAVINGSTYPE, variables: { type } });
        data && set({ savingsType: data.savings_typeCollection.edges[0].node });
    },
    getInterestRate: async (name: string) => {
        const { data } = await client.query({ query: INTERESTRATE, variables: { name } });
        data && set({ interestRate: data?.savings_interestCollection?.edges[0]?.node });
    },
    getBenefitSavingsClassById: async (savings_type_id: number) => {
        const { data } = await client.query({query: GET_BENEFITCLASSBYID, variables: { savings_type: savings_type_id }});
        set({ benefitSavingsClass: data?.savings_benefitsCollection?.edges });
    },
    getSavingsFrequency: async () => {
        const { data } = await client.query({query: GET_SAVINGS_FREQUENCY, variables:{}});
        set({ savingsFrequency: data?.savings_frequencyCollection?.edges });
    },
    getSavingsMode: async () => {
        const { data } = await client.query({query: GET_SAVINGS_MODE, variables:{}});
        set({ savingsMode: data?.savings_modeCollection?.edges });
    },
    addFixedDeposit: async (input: Object) => {
        const { data } = await client.mutate({ mutation: ADD_SAVINGS, variables: { input } });
        return data?.insertIntosavingsCollection?.records;
    },
    addThriftSavings: async (input: Object) => {
        const { data } = await client.mutate({ mutation: ADD_SAVINGS, variables: { input } });
        return data?.insertIntosavingsCollection?.records;
    },
    addTargetSavings: async (input: Object) => {
        const { data } = await client.mutate({ mutation: ADD_SAVINGS, variables: { input } });
        return data?.insertIntosavingsCollection?.records;
    },
    updateThriftSavings: async (id: number, input: Object) => {
        const { data } = await client.mutate({ mutation: UPDATE_THRIFTSAVINGS, variables: { id, input } });
        return data;
    },
    addBenefitSavings: async (input: Object) => {
        const { data } = await client.mutate({ mutation: ADD_SAVINGS, variables: { input }});
        return !!data;
    },
    addSmartKiddiesSavings: async (input: Object) => {
        const { data } = await client.mutate({ mutation: ADD_SAVINGS, variables: { input } });
        return !!data;
    }
}),
    {
    name: '@savings-data',
    storage: createJSONStorage(() => MMKVStorage),
    }
));


