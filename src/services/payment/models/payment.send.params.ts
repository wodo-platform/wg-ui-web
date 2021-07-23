import { IWalletAccount } from "@/services/banano/models";
import BigNumber from "bignumber.js";

export default interface PaymentSendParams {
    fromAccount: IWalletAccount,
    toAccountAddress: String,
    amount: BigNumber
}