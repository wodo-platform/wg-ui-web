import { IWalletAccount } from '@/services/banano/models';
import BigNumber from 'bignumber.js';
export default interface IWithdraw {
    fromAccount: IWalletAccount;
    amount: BigNumber;
  }