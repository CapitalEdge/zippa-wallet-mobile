import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MMKVStorage } from './mmkv-storage'

interface iGLOBAL {
    setAppState: any
    isDisabled: boolean
    appInfo: any
    appState: 'LOADING' | 'IDLE' | 'LOADED'
}

export const useGlobalStore = create<iGLOBAL>()(
    persist((set) => ({
        isDisabled: false,
        appState: 'IDLE',
        appInfo: {},
        setAppState: (state: iGLOBAL['appState']) => set({ appState: state }),
        setIsDisabled: (state: iGLOBAL['isDisabled']) => set({ isDisabled: state }),
        
    }),
    {
        name: '@global',
        storage: createJSONStorage(() => MMKVStorage),
    }
    )
)