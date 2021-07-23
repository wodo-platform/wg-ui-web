import IAccount from "./IAccount";

export default interface IWallet {
    id:             number;
    name:           string;
    description:    string;
    balance:         number;
    pending:         number;
    seed:           string;
    mnemonic:       string;
    enabled:        boolean;
    deleted:        boolean;
    createdAt:      Date;
    updatedAt:      Date;
    userId:         number;
    accounts:       IAccount[] | null;
  }