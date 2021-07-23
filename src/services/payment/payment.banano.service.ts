import BigNumber from 'bignumber.js';
import { injectable } from "tsyringe";
import { ApiService } from "../banano/api.service";
import { AppSettingsService } from "../banano/app-settings.service";
import { IWalletAccount } from "../banano/models";
import { BananoBlockService } from "../banano/nano-block.service";
import { NotificationService } from "../banano/notification.service";
import { PriceService } from "../banano/price.service";
import { UtilService } from "../banano/util.service";
import { WorkPoolService } from "../banano/work-pool.service";
import PaymentSendParams from './models/payment.send.params';
import IPaymentService from './payment.service.interface';

@injectable()
export class PaymentBananoService implements IPaymentService{

    public houseAccountAddress = "ban_3fbbbg4edefr1fjbkhjke37s58tw17t6ct7txrw4yf1ijoz1ythu8c4wsc5b";

    banoshi = 1000000000000000000000000000;
    amounts = [
        { name: 'BANANO', shortName: 'BANANO', value: 'banano' },
        { name: 'banoshi (0.01 BANANO)', shortName: 'banoshi', value: 'banoshi' },
    ];
    selectedAmount = this.amounts[0];

    constructor(
        private notificationService: NotificationService,
        private nodeApi: ApiService,
        private bananoBlock: BananoBlockService,
        public price: PriceService,
        private workPool: WorkPoolService,
        public settings: AppSettingsService,
        private util: UtilService) {
    }

    public getHouseAccountAddress() : string {
        return this.houseAccountAddress;
    }

    public async send(paymentSendParams: PaymentSendParams): Promise<any> {
        
        let fromAccount: IWalletAccount = paymentSendParams.fromAccount;
        let toAccountAddress: String = paymentSendParams.toAccountAddress;
        let amount: BigNumber = paymentSendParams.amount;

        if (amount.isLessThan(0)) {
            this.notificationService.sendWarning(`Amount is invalid`);
            throw Error(`Amount is invalid`);
        }
        let amountRaw: BigNumber = new BigNumber(0);
        let rawAmount: BigNumber = new BigNumber(0);
        let toAccount: any = false;
        let toAccountStatus = null;

        const isValid = await this.nodeApi.validateAccountNumber(toAccountAddress);
        if (!isValid || isValid.valid == '0') 
        { 
            this.notificationService.sendWarning(`To account address is not valid`);
            throw Error(`To account address is not valid`);
        }
        if (!fromAccount || !toAccountAddress) {
            this.notificationService.sendWarning(`From and to account are required`);
            throw Error(`From and to account are required`);
        }

        //const from = await this.nodeApi.accountInfo(fromAccount.id);
        const to = await this.nodeApi.accountInfo(toAccountAddress);
        /*if (!from) {
            this.notificationService.sendError(`From account not found`);
            throw Error(`From account not found`);
        }*/
        let fromAccountBalanceBN : BigNumber = new BigNumber(fromAccount.balance || 0);
        to.balanceBN = new BigNumber(to.balance || 0);

        //fromAccount = from;
        toAccount = to;

        const rawAmount1 = this.getAmountBaseValue(amount || 0);
        rawAmount = rawAmount1.plus(amountRaw);

        const bananoAmount = rawAmount.div(this.banoshi);

        if (amount.isLessThan(0) || rawAmount.isLessThan(0)) {
          this.notificationService.sendWarning(`Amount is invalid`);
          throw Error(`Amount[${amount}] is invalid`);
        }
        if (rawAmount.isLessThan(1)) {
          this.notificationService.sendWarning(`Transactions for less than 1 raw will be ignored by the node.  Send raw amounts with at least 1 raw.`);
          throw Error(`Transactions for less than 1 raw will be ignored by the node.  Send raw amounts with at least 1 raw.`);
        }
        if (fromAccountBalanceBN.minus(rawAmount).isLessThan(0)) {
          this.notificationService.sendError(`From account does not have enough BANANO`);
          throw Error(`From account does not have enough BANANO`);
      }

        // Determine a proper raw amount to show in the UI, if a decimal was entered
        amountRaw = rawAmount.mod(this.banoshi);

       

        // Start precopmuting the work...
        this.workPool.addWorkToCache(fromAccount.frontier);

        let newHash : string= null;
        try {
             newHash = await this.bananoBlock.generateSend(fromAccount, toAccountAddress, rawAmount, false);
            if (newHash) {
              this.notificationService.sendSuccess(`Successfully sent ${amount} ${this.selectedAmount.shortName}!`);
              amount = null;
            } else {
                this.notificationService.sendError(`There was an error sending your transaction, please try again.`)
                throw new Error(`There was an error sending your transaction, please try again.`);
            }
          } catch (err) {
            this.notificationService.sendError(`There was an error sending your transaction: ${err.message}`)
            throw err;
          }
          //await this.walletService.reloadBalances();
          return newHash;
    }

    async validateAccount(accountAddress:string) : Promise<any> {
      
        // Remove spaces from the account id
        accountAddress = accountAddress.replace(/ /g, '');
    
        // const accountInfo = await this.walletService.walletApi.accountInfo(this.toAccountID);
        const accountInfo = await this.nodeApi.accountInfo(accountAddress);
        if (accountInfo.error) {
          if (accountInfo.error == 'Account not found') {
            return  1;
          } else {
            return  0;
          }
        }
        if (accountInfo && accountInfo.frontier) {
          return  2;
        }
      }

      setMaxAmount(walletAccount: IWalletAccount) {
        let amountRaw = walletAccount.balanceRaw;
        const bananoVal = this.util.banano.rawToRaw(walletAccount.balance).integerValue;
        const maxAmount = this.getAmountValueFromBase(this.util.banano.rawToRaw(bananoVal));
        let amount = maxAmount.toNumber();
        //this.syncFiatPrice();
      }
    
      getAmountBaseValue(value) {
    
        switch (this.selectedAmount.value) {
          default:
          case 'raw': return this.util.banano.rawToRaw(value);
          case 'banoshi': return this.util.banano.banoshiToRaw(value);
          case 'banano': return this.util.banano.banToRaw(value);
        }
      }
    
      getAmountValueFromBase(value) {
        switch (this.selectedAmount.value) {
          default:
          case 'raw': return this.util.banano.rawToRaw(value);
          case 'banoshi': return this.util.banano.rawToBanoshi(value);
          case 'banano': return this.util.banano.rawToBan(value);
        }
      }
}