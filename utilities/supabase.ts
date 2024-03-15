import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import { APP_URL, APP_ANON_KEY } from '../constants/Constants'
import { MMKVStorage } from '../stores/mmkv-storage'

const supabaseUrl = APP_URL!
const supabaseAnonKey = APP_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: MMKVStorage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    db: {
        schema: 'public',
    },
})