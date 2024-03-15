import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKVStorage } from "../mmkv-storage";
import { InterSwitch } from "../../utilities/isw";
import client from "../../utilities/apolloClient";
import { AirtimeAndDataMutation } from "../../helpers/graphQL/mutation/airtimeAndDataMutation";

const interswitch = InterSwitch()

interface iBillsStore {
    banks: [],
    power: [],
    internet: [],
    mtn_data: [],
    glo_data: [],
    etisalat_data: [],
    airtel_data: [],
    mtn_airtime: [],
    glo_airtime: [],
    etisalat_airtime: [],
    airtel_airtime: [],
    dstv: [],
    gotv: [],
    allBanks: () => Promise<void>,
    allBillers: () => Promise<void>;
    billerItem: (billerId: number) => Promise<any>;
    addAirtimeAndData: (input: Object) => Promise<any>;
}

/**
 * A zustand store for savings-related data.
 */
export const useBillsStore = create<iBillsStore>()(persist((set) => ({
    banks: [],
    mtn_data: [],
    glo_data: [],
    etisalat_data: [],
    airtel_data: [],
    mtn_airtime: [],
    glo_airtime: [],
    etisalat_airtime: [],
    airtel_airtime: [],
    dstv: [],
    gotv: [],
    power: [],
    internet: [],
    allBanks: async () => {
        const data = await interswitch.getBanks();
        set({ banks: data });
    },
    
    allBillers: async () => { 
        const [
            mtn_dataData,
            glo_dataData,
            etisalat_dataData,
            airtel_dataData,
            mtn_airtimeData,
            glo_airtimeData,
            etisalat_airtimeData,
            airtel_airtimeData,
            dstvData,
            gotvData,
            powerData,
            internetData
        ] = await Promise.all([
            interswitch.getBillerItems(348),
            interswitch.getBillerItems(3070),
            interswitch.getBillerItems(205),
            interswitch.getBillerItems(2775),
            interswitch.getBillerItems(109),
            interswitch.getBillerItems(913),
            interswitch.getBillerItems(908),
            interswitch.getBillerItems(901),
            interswitch.getBillerItems(104),
            interswitch.getBillerItems(459),
            interswitch.getBillersById(1),
            interswitch.getBillersById(1)
        ]);

        set({
            mtn_data: mtn_dataData,
            airtel_data: airtel_dataData,
            glo_data: glo_dataData,
            etisalat_data: etisalat_dataData,

            mtn_airtime: mtn_airtimeData,
            airtel_airtime: airtel_airtimeData,
            glo_airtime: glo_airtimeData,
            etisalat_airtime: etisalat_airtimeData,

            dstv: dstvData,
            gotv: gotvData,
            
            power: powerData,
            internet: internetData,
        })
    },
    billerItem: async (billerId:number) => {
        const items = await interswitch.getBillerItems(billerId);
        return items;
    },
    addAirtimeAndData: async (input: Object) => {
        const { data } = await client.mutate({ mutation: AirtimeAndDataMutation, variables: { input } });
        return data?.insertIntoairtime_and_dataCollection?.records;
    }
}),
    {
        name: '@bills-data',
        storage: createJSONStorage(() => MMKVStorage),
    }
));