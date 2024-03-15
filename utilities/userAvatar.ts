import { decode } from "base64-arraybuffer-es6";
import { supabase } from "./supabase";


export const uploadAvatar = async ({ userId, base64Image, fileName }: { userId: string, base64Image: string | undefined | null, fileName: string }) => {
    const { data, error } = await supabase
        .storage
        .from('avatar')
        .upload(`${userId}/${(fileName.toLowerCase())}.png`, decode(base64Image!), {
            contentType: 'image/png',
            upsert: true,
        });
    if (error) {
        console.log(error)
    }
    return data;
}

export const createAvaterUrl = async ({ userId, fileName }: { userId: string, fileName: string }) => {
    //N.B:: 13148730 is 25years in seconds as required before link expiration
    const { data } = await supabase
        .storage
        .from('avatar')
        .createSignedUrl(`${userId}/${(fileName.toLowerCase())}.png`, 13148730, {
            transform: {
                width: 100,
                height: 100,
            }
        });
    if (!data) {
        throw new Error("Error generating url");
    } else {
        await supabase
            .from('users')
            .update({ avatar: data?.signedUrl })
            .eq('id', userId)
            .select();
    }
    return data;
}
