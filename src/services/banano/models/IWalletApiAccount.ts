import IBaseApiAccount from "./IBaseApiAccount";

export default interface IWalletApiAccount extends IBaseApiAccount {
    addressBookName?: string|null;
    id?: string;
  }