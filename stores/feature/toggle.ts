import { create } from "zustand";

interface TOGGLE {
    modalVisible: boolean
    toggleModalVisible: (state: boolean) => void
}

export const useToggleStore = create<TOGGLE>((set) => ({
    modalVisible: false,
    toggleModalVisible: (state: boolean) => set({
        modalVisible: state
    })
}));