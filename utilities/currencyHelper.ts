import { dinero, toDecimal, add, subtract, multiply } from 'dinero.js';
import { NGN } from '@dinero.js/currencies';

const amountInNaira = (amount: number) => toDecimal(dinero({ amount: parseInt((amount * 100).toFixed(2)), currency: NGN }));

export {
    amountInNaira,
    add,
    subtract,
    multiply
}