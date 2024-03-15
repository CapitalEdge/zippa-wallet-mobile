export type THEME = {
    colors: {
        zippaBlue: string;
        zippaLight: string;
        zippaGreen: string;
        zippaRed: string;
        zippaYellow: string;
        zippaGrey: string;
        zippaBlack: string;
        zippaWhite: string;
        zippaSubtle: string;
        zippaSubtleRed: string;
        zippaSubtleGreen: string;
        zippaViolet: string;
        zippaOrange: string;
        zippaPink: string;
        zippaLightBlue: string;
        zippaSubtleViolet: string;
        zippaSubtleOrange: string;
        zippaDisabled: string;
    };
}

export type UserState = {
    userData: any;
    getUserData: (id: string) => Promise<void>;
    updateUser: (id: string, input: Object ) => Promise<any>;
    clearUserData: () => void;
    setUserData: (input: Object) => void
}

export type TextProps = {
    color?: string
    fontSize?: number | any
    fontFamily?: string
}

export type CardProps = {
    color?: string;
    backgroundColor?: string;
    border?: string;
}

export type TransactionDATA = {
    id: number;
    name: string;
    amount: string;
    date: string;
    success: boolean;
    type: string;
};

export type FormField = {
    email: string;
    phone?: string;
    password: string;
    confirm_password?: string;
};

export type PersonalInformationField = {
    avatar?: string;
    firstname: string;
    lastname: string;
    username: string;
    address: string;
    state: string;
    city: string;
    dob: string;
    gender: string;
    phone: string;
}

export type SETTINGSITEMS = { id: number; icon: string; text: string; link?: string, ext: boolean }

export type iMonths = {
    id: number;
    month: number;
    label: string;
}

export type iFixedDepositData = {
    node?: any;
    name?: string
    amount?: string;
    interest?: number;
    term?: string;
    total_amount?: string;
    savings_mode?: number;
    frequency?: number;
    created_at?: string;
    end_date?: string
}

export type iSavingWithBenefitData = {
    node: any;
    name: string;
    amount?: string;
    benefitClass?: string;
    benefits?: string;
    dateAdded?: string;
    maturityDate?: string;
}

export type iSavingWithBenefitClass = {
    id: number;
    value: number;
    label: string;
}

export type iBenefitClassData = {
    benefitAmount: number;
    benefitClass: string;
    benefits: string;
    dateAdded: string;
    maturityDate: string;
}

export type iSmartKiddiesSavingsData = {
    node?: any
    savingsAmount: string;
    smartKiddiesClass: string;
    incentives: string;
    dateAdded: string;
    maturityDate: string;
}

export type iSavingsTypeData = {
    id: string;
    name: string;
    created_at: string;
}

export type iSmartKiddiesSavingsClass = {
    id: number;
    value: number;
    label: string;
}

export type iThriftRecurrence = {
    id: number;
    value: string;
    label: string;
}

export type iThriftSavingsData = {
    data: any[] | undefined;
    name?: string;
    amount?: string;
    interest?: number;
    frequency?: string;
    totalAmount?: string;
    created_at?: string;
}

export type iTargetSavingsData = {
    data?: any[] | undefined;
    name?: string;
    amount?: string;
    interest?: number;
    frequency?: string;
    term?: string;
    total_amount?: string;
    created_at?: string;
    end_date?: string;
    savings_mode?: number
}


export interface iBVNDATA {
    verificationRequests: {
        type?: string;
        lastName: string;
        identityNumber: string | undefined;
        phone: string;
        country?: string;
        birthCountry?: string;
        nationality?: string;
        reprocess?: string;
    };
    type?: string;
    email: string;
    phone: string;
    lastName: string;
    firstName: string;
    birthDate: string;
    gender: string | undefined;
    callbackUrl?: string;
}