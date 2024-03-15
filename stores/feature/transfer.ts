import { create } from "zustand";

interface TOGGLE {
    pinConfirmed: boolean
    setPinConfirmed: (state: boolean) => void
}

export const useTransferStore = create<TOGGLE>((set) => ({
    pinConfirmed: false,
    setPinConfirmed: (state: boolean) => set({
        pinConfirmed: state
    })
}));