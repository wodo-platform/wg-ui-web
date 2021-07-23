import {BigNumber} from 'bignumber.js';
export default interface IWalletAccount {
    id: string;
    frontier: string|null;
    secret: any;
    keyPair: any;
    index: number;
    balance: BigNumber;
    pending: BigNumber;
    balanceRaw: BigNumber;
    pendingRaw: BigNumber;
    balanceFiat: number;
    pendingFiat: number;
    addressBookName: string|null;
  }