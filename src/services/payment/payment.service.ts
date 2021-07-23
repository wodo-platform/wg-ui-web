import { injectable } from "tsyringe";
import {container} from "tsyringe";
import { AppSettingsService } from "../banano/app-settings.service";
import PaymentSendParams from './models/payment.send.params';
import { PaymentBananoService } from './payment.banano.service';
import IPaymentService from './payment.service.interface';

@injectable()
export class PaymentService implements IPaymentService {

  public coinType = "Banano";
  public paymentServiceInstance : IPaymentService = null;
 
  constructor(private appSettingsService: AppSettingsService) {
   if(appSettingsService.settings.coinType.toLowerCase() == appSettingsService.coinTypeBanano) {
    this.paymentServiceInstance = container.resolve(PaymentBananoService);
   }
   else{
     throw new Error("Only banano coin is accepted at the moment, Please adjust your application settings.");
   }
  }

  public async send(paymentSendParams: PaymentSendParams): Promise<any> {
    return this.paymentServiceInstance.send(paymentSendParams);
  }

  public getHouseAccountAddress() : string  {
    return  this.paymentServiceInstance.getHouseAccountAddress();
  }

}