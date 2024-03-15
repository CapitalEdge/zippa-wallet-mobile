export function VerifiedAfrica(apiKey: string) {
    const userId = "1700180150304";
    const endpoint = "https://api.verified.africa/sfx-verify/v3/id-service/";

    const controller = new AbortController();
    const signal = controller.signal;
    
    async function verify({ idNumber, verificationType, countryCode, transactionReference, otpMethod, otp }: { idNumber?: string, verificationType?: string, countryCode?: string, transactionReference?: string, otpMethod?: string, otp?: string }) {
        const option = {
            method: "POST",
            headers: {
                userId: userId,
                ApiKey: apiKey,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                verificationType: verificationType,
                searchParameter: idNumber,
                countryCode: countryCode,
                transactionReference: transactionReference,
                otpMethod: otpMethod,
                otp: otp
            }),
            signal
        }
        try {
            const response = await fetch(endpoint, option);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
        }
    };
    
    return {
        verify,
        controller
    };
}
