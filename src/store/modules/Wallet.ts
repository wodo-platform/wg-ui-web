import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "../index";
import modulesNames from "../modulesNames";
import { ICurrentWallet, IWithdraw } from "../models";
import { IWallet, IWalletUpdateRequestParams } from "@/services/wodoApi/models";
import { iwalletMock } from "@/services/wodoApi/mock.data";
import { PaymentService } from "@/services/payment/payment.service";
import {container,Lifecycle} from "tsyringe";
import PaymentSendParams from '@/services/payment/models/payment.send.params';

@Module({ dynamic: true, namespaced: true, store, name: modulesNames.wallet })
class Wallet extends VuexModule {

  private _currentWallet?: ICurrentWallet | null = null;
  private paymentService: PaymentService = container.resolve(PaymentService);

  @Mutation
  private SET_CURRENT_WALLET(currentWallet?: ICurrentWallet): void {
    this._currentWallet = currentWallet;
  }

  @Action({ rawError: true })
  private setFromIWallet(wallet: IWallet): void {
    let currentWal : ICurrentWallet = {
      account: wallet?.accounts[0]?.address,
      seed: wallet.seed,
      mnemonic: wallet.mnemonic
    };
    this.SET_CURRENT_WALLET(currentWal);
  }


  @Action({ rawError: true })
  async update(params: IWalletUpdateRequestParams): Promise<void> {
   // const res = await UserUpdate(params);
    this.setFromIWallet(iwalletMock);
  }

  @Action({ rawError: true })
  async send(iWithdraw: IWithdraw) : Promise<String> {
    let paymentSendParams: PaymentSendParams = {
      fromAccount: iWithdraw.fromAccount,
      toAccountAddress: this.paymentService.getHouseAccountAddress(),
      amount: iWithdraw.amount
    }
    return await this.paymentService.send(paymentSendParams);
  }

}

export default getModule(Wallet);