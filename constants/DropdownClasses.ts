import { iMonths, iSavingWithBenefitClass, iSmartKiddiesSavingsClass, iThriftRecurrence } from "../helpers/types";

export const SavingWithBenefitClass: iSavingWithBenefitClass[] = [
    {
        id: 1,
        value: 1000000,
        label: "Diamond"
    },
    {
        id: 2,
        value: 500000,
        label: "Gold"
    },
    {
        id: 3,
        value: 250000,
        label: "Silver"
    },
    {
        id: 4,
        value: 150000,
        label: "Bronze"
    },
    {
        id: 5,
        value: 50000,
        label: "Basic"
    }
];

export const SmartKiddiesSavingsClass: iSmartKiddiesSavingsClass[] = [
    {
        id: 1,
        value: 100000,
        label: "Smart 100"
    },
    {
        id: 2,
        value: 50000,
        label: "Smart 50"
    },
    {
        id: 3,
        value: 30000,
        label: "Smart 30"
    },
    {
        id: 4,
        value: 20000,
        label: "Smart 20"
    }
];

export const Months: iMonths[] = [
    {
        id: 1,
        month: 1,
        label: "1 month"
    },
    {
        id: 2,
        month: 2,
        label: "2 months"
    },
    {
        id: 3,
        month: 3,
        label: "3 months"
    },
    {
        id: 4,
        month: 4,
        label: "4 months"
    },
    {
        id: 5,
        month: 5,
        label: "5 months"
    },
    {
        id: 6,
        month: 6,
        label: "6 months"
    },
    {
        id: 7,
        month: 7,
        label: "7 months"
    },
    {
        id: 8,
        month: 8,
        label: "8 months"
    },
    {
        id: 9,
        month: 9,
        label: "9 months"
    },
    {
        id: 10,
        month: 10,
        label: "10 months"
    },
    {
        id: 11,
        month: 11,
        label: "11 months"
    },
    {
        id: 12,
        month: 12,
        label: "12 months"
    },
];


export const ThriftRecurrence: iThriftRecurrence[] = [
    {
        id: 1,
        value: "daily",
        label: "Daily"
    },
    {
        id: 2,
        value: "weekly",
        label: "Weekly"
    },
    {
        id: 3,
        value: "monthly",
        label: "Monthly"
    },
];