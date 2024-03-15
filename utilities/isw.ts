import { ISW_PROD_CLIENT_ID, ISW_PROD_CLIENT_SECRET, ISW_TERMINAL_ID, ISW_PROD_URL, ISW_GENERATE_TOKEN_URL, ISW_VA_CLIENT_ID, ISW_VA_CLIENT_SECRET, ISW_VA_ENDPOINT } from "../constants/Constants";
import { Buffer } from "buffer";
import { supabase } from "./supabase";
import { MMKVStorage } from "../stores/mmkv-storage";

/**
 * InterSwitch utility functions.
 */
export function InterSwitch() {
    const accept = 'application/json';
    const contentType = 'application/json';
    const TerminalID = ISW_TERMINAL_ID!;
    const baseUrl = ISW_PROD_URL;
    const tokenBaseUrl = ISW_GENERATE_TOKEN_URL
    const timeNowInSeconds = new Date().getTime() / 1000;  

    /**
     * Retrieves the InterSwitch auth token.
     * @returns {Promise<Object>} The InterSwitch auth token.
     */
    const getISWToken = async (): Promise<{
        access_token: string;
        merchant_code: string;
        client_name: string;
        payable_id: string;
        expiry: string;
    } | undefined> => {
        const endpoint = `${tokenBaseUrl}?grant_type=client_credentials`;
        const ContentType = "application/x-www-form-urlencoded"
        const base64Credentials = Buffer.from(ISW_PROD_CLIENT_ID + ":" + ISW_PROD_CLIENT_SECRET).toString("base64");

        const options = {
            method: "POST",
            headers: {
                authorization: `Basic ${base64Credentials}`,
                accept,
                contentType: ContentType
            }
        };

        try {
            const res = await fetch(endpoint, options);
            let result = await res.json();

            result = Object.assign(result, { expiry: result?.expires_in + timeNowInSeconds });
            const { access_token, merchant_code, payable_id, client_name, expiry } = result;
            MMKVStorage.setItem('@isw-token', JSON.stringify(result));
            return {
                access_token,
                merchant_code,
                client_name,
                payable_id,
                expiry
            };
        } catch (error) {
            console.log(error);
        }
    };

    const getVAISWToken = async (): Promise<{
        access_token: string;
        merchant_code: string;
        client_name: string;
    } | undefined> => {
        const endpoint = `${tokenBaseUrl}?grant_type=client_credentials`;
        const ContentType = "application/x-www-form-urlencoded"
        const base64Credentials = Buffer.from(ISW_VA_CLIENT_ID + ":" + ISW_VA_CLIENT_SECRET).toString("base64");

        const options = {
            method: "POST",
            headers: {
                authorization: `Basic ${base64Credentials}`,
                accept,
                contentType: ContentType
            }
        };

        try {
            const res = await fetch(endpoint, options);
            let result = await res.json();

            const { access_token, merchant_code, client_name } = result;
            MMKVStorage.setItem('@isw-token', JSON.stringify(result));
            return {
                access_token,
                merchant_code,
                client_name,
            };
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Retrieves the token data.
     * @returns {Promise<Object>} The token data.
     */
    const tokenData = async () => {
        const localTokenData = await JSON.parse(MMKVStorage.getItem("@isw-token") as string);
        if (!localTokenData || (localTokenData.expiry < timeNowInSeconds)) {
            const value = await getISWToken();
            return value;
        }
        return localTokenData;
    }

    /**
     * Generates an account number for the given account name.
     * @param {string} accountName - The account name.
     * @param {string} userId - The user id.
     * @returns {Promise<any[]>}
     * @throws {Error} If there is an error generating the account number.
     */
    const generateAccounNumber = async (accountName: string, userId: string): Promise<any> => {
        const endpoint = `${ISW_VA_ENDPOINT}/paymentgateway/api/v1/payable/virtualaccount`;
        const response = await getVAISWToken();
        const { access_token, merchant_code } = response || {};

        const options = {
            method: "POST",
            headers: {
                authorization: `Bearer ${access_token}`,
                accept,
                'Content-Type': contentType
            },
            body: JSON.stringify({
                "accountName": accountName,
                "merchantCode": merchant_code?.toUpperCase()
            })
        }

        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();

            if (result?.enabled) {
                const { accountName, accountNumber, bankCode, bankName, name, payableCode } = result;
                const { data, error } = await supabase
                    .from('users')
                    .update({
                        account_number: accountNumber,
                        bank_details: {
                            accountName,
                            accountNumber,
                            bankCode,
                            bankName,
                            name,
                            payableCode
                        }
                    })
                    .eq('id', userId)
                    .select();
                if (data) {
                    return data;
                } else {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
        return;
    };

    /**
     * Send money to bank.
     * @param {string} account number - The destination account number.
     * @returns {Promise<any>}
     * @throws {Error} If there is an error retrieving the billers.
     */
    const sendMoney = async (account: Object): Promise<any> => {
        const endpoint = `${baseUrl}/quicktellerservice/api/v5/transactions/TransferFunds`;
        const { access_token } = await tokenData();

        const options = {
            method: "POST",
            headers: {
                authorization: `Bearer ${access_token}`,
                accept,
                contentType,
                TerminalID
            },
            body: JSON.stringify(account)
        }

        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();
            return result;
        } catch (error) {
            console.log(error)
        }

    };

    const getBillers = async (): Promise<any> => {
        const endpoint = `${baseUrl}/quicktellerservice/api/v5/services`;
        const { access_token } = await tokenData();

        const options = {
            method: "GET",
            headers: {
                authorization: `Bearer ${access_token}`,
                accept,
                contentType,
                TerminalID
            }
        }

        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();
            return result?.BillerList?.Category;
        } catch (error) {
            console.log(error)
        }

    };

    /**
     * Retrieves billers by their ID.
     * @param {number} id - The ID of the biller.
     * @returns {Promise<any>}
     * @throws {Error} If there is an error retrieving the billers.
     */
    const getBillersById = async (id: number): Promise<any> => {
        const endpoint = `${baseUrl}/quicktellerservice/api/v5/services?categoryId=${id}`;
        const { access_token } = await tokenData();

        const options = {
            method: "GET",
            headers: {
                authorization: `Bearer ${access_token}`,
                accept,
                contentType,
                TerminalID
            }
        }

        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();
            return result?.BillerList?.Category[0]?.Billers;
        } catch (error) {
            console.log(error)
        }

    };

    /**
     * Posts an airtime recharge request.
     * @param {Object} requestData - The data for the recharge request.
     * @returns {Promise<any>}
     */
    const postBillPaymentAdvice = async (requestData: Object): Promise<any> => {

        const data = await tokenData();
        const { access_token } = data!;
        const endpoint = `${baseUrl}/quicktellerservice/api/v5/Transactions`;
        const options = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": contentType,
                "TerminalID": TerminalID
            },
            body: JSON.stringify(requestData)
        }

        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();
            return result;
        } catch (error) {
            console.log(error)
        };
    };

    /**
     * Retrieves the billers item for a given biller ID.
     * @param {number} billerid - The ID of the biller.
     * @returns {Promise<any>}
     */
    const getBillerItems = async (billerid: number): Promise<any> => {
        const data = await tokenData();
        const { access_token } = data!;
        const endpoint = `${baseUrl}/quicktellerservice/api/v5/services/options?serviceid=${billerid}`;
        const options = {
            method: 'GET',
            headers: {
                authorization: `Bearer ${access_token}`,
                accept,
                contentType,
                TerminalID
            }
        };

        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();
            return result?.PaymentItems;

        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Fetches account detail.
     * @param {Object} params - The parameters for the account detail.
     * @returns {Promise<any>}
     */
    const fetchAccountDetail = async ({ account, bankCode}:{account: string, bankCode: string}) => {
        const { access_token } = await tokenData();
        const endpoint = `${baseUrl}/quicktellerservice/api/v5/Transactions/DoAccountNameInquiry`;
        const options = {
            method: 'GET',
            headers: {
                authorization: `Bearer ${access_token}`,
                accept,
                contentType,
                TerminalID,
                bankcode: bankCode,
                accountid: account
            }
        }

        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();
            return result;

        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Retrieves the banks.
     * @returns {Promise<any>}
     */
    const getBanks = async () => {
        const { access_token } = await tokenData();
        const endpoint = `${baseUrl}/quicktellerservice/api/v5/configuration/fundstransferbanks`;
        const options = {
            method: 'GET',
            headers: {
                authorization: `Bearer ${access_token}`,
                accept,
                contentType,
                TerminalID
            }
        };

        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();
            return result?.Banks;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Validates the customer.
     * @param {Object} customer - The customer to validate.
     * @returns {Promise<any>}
     */
    const customerValidation = async (customer: Object): Promise<any> => {

        const customerData = Object.assign(customer, {terminalId:TerminalID});

        const data = await tokenData();
        const { access_token } = data!;
        const endpoint = `${baseUrl}/quicktellerservice/api/v5/Transactions/validatecustomers`;
        const options = {
            method: 'POST',
            headers: {
                authorization: `Bearer ${access_token}`,
                accept,
                contentType,
                TerminalID
            },
            body: JSON.stringify(customerData)
        }

        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();
            console.log(result)
            return result;

        } catch (error) {
            console.log(error)
        };
    };

    const confirmTransaction = async (transactionRef: string) => {
        const data = await tokenData();
        const { access_token } = data!;
        const endpoint = `${baseUrl}/quicktellerservice/api/v5/Transactions?requestRef=${transactionRef}`;
        const options = {
            method: "GET",
            headers: {
                authorization: `Bearer ${access_token}`,
                accept: "application/json",
                contentType: "application/json",
            },
        };
        try {
            const res = await fetch(endpoint, options);
            const result = await res.json();
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    return {
        sendMoney,
        generateAccounNumber,
        getBillers,
        getBillersById,
        postBillPaymentAdvice,
        getBillerItems,
        getBanks,
        fetchAccountDetail,
        tokenData,
        customerValidation,
        confirmTransaction,
    }
}
