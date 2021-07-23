
export default interface IWalletUpdateRequestParams {
    id: number;
    seed: string;
    account: string | null;
    mnemonic: string | null;
  }