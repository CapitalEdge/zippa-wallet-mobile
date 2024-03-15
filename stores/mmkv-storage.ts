import { StateStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

interface STORAGE extends StateStorage {
    clearAll: () => void;
}

export const MMKVStorage: STORAGE = {
    setItem: (name, value) => {
        return storage.set(name, value)
    },
    getItem: (name) => {
        const value = storage.getString(name)
        return value ?? null
    },
    removeItem: (name) => {
        return storage.delete(name)
    },
    clearAll: () => {
        return storage.clearAll()
    }
}