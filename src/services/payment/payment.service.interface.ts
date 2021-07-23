import BigNumber from "bignumber.js";
import { IWalletAccount } from "../banano/models";
import PaymentSendParams from "./models/payment.send.params";

export default interface IPaymentService {
    send(paymentSendParams: PaymentSendParams): Promise<any>;
    getHouseAccountAddress() : string;
}