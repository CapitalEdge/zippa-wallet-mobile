import { registerSheet } from 'react-native-actions-sheet';
import FixedDeposit from './savingsSheets/fixedDeposit';
import SavingsWithBenefit from './savingsSheets/savingsWithBenefit';
import SmartKiddies from './savingsSheets/smartKiddies';
import ThriftSavings from './savingsSheets/thriftSavings';
import TargeSavings from './savingsSheets/targetSavings';
import SuccessfulTransaction from './transactionsSheets/successfulTransaction';
import FailedTransaction from './transactionsSheets/failedTransaction';
import AccountDetails from './topUpSheets/accountDetails';
import Airtime from './billAndDataSheets/airtime';
import Electricity from './billAndDataSheets/electricity';
import CableTv from './billAndDataSheets/cable-tv';
import MobileData from './billAndDataSheets/mobile-data';
import SendMoney from './sendMoneySheets/sendMoney';
import VerifyOTP from './verifyOTPSheets/verifyOtp';
import BillConfirmation from './billAndDataSheets/confirmation';
import ComingSoon from './comingSoon/comingSoon';


registerSheet("fixed-deposit-sheet", FixedDeposit);
registerSheet("savings-with-benefits", SavingsWithBenefit);
registerSheet("smart-kiddies-savings", SmartKiddies);
registerSheet("thrift-savings", ThriftSavings);
registerSheet("target-savings", TargeSavings);
registerSheet("successful-transaction", SuccessfulTransaction);
registerSheet("failed-transaction", FailedTransaction);
registerSheet("topup-wallet", AccountDetails);
registerSheet("airtime", Airtime);
registerSheet("mobile-data", MobileData);
registerSheet("electricity", Electricity);
registerSheet("cable-tv", CableTv);
registerSheet("send-money", SendMoney);
registerSheet("verify-otp", VerifyOTP); 
registerSheet("bill-confirmation", BillConfirmation); 
registerSheet("coming-soon", ComingSoon); 

export { };