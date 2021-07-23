import {BigNumber} from 'bignumber.js';
import IWalletAccount from './IWalletAccount';
import { WalletType } from './WalletType';

export default interface IFullWallet {
    type: WalletType;
    seedBytes: any;
    seed: string|null;
    balance: BigNumber;
    pending: BigNumber;
    balanceRaw: BigNumber;
    pendingRaw: BigNumber;
    balanceFiat: number;
    pendingFiat: number;
    hasPending: boolean;
    accounts: IWalletAccount[];
    accountsIndex: number;
    locked: boolean;
    password: string;
  }