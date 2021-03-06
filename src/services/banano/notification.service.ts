import {injectable} from "tsyringe";
import * as Rx from 'rxjs';

type NotificationType = 'info'|'success'|'warning'|'error';

@injectable()
export class NotificationService {

  notifications$ = new Rx.BehaviorSubject(null);
  removeNotification$ = new Rx.BehaviorSubject(null);

  constructor() { }

  // This provides an entry point for all components to send notifications.
  // It exposes an observable that the actual component uses to grab new notifications

  sendNotification(type: NotificationType, message: string, options = {}) {
    console.log("Notification: type["+type+"], message["+message+"], options:"+JSON.stringify(options))
    this.notifications$.next({ type, message, options });
  }

  removeNotification(identifier: string) {
    this.removeNotification$.next(identifier);
  }

  sendInfo(message:string, options = {}) {
    this.sendNotification('info', message, options);
  }
  sendSuccess(message:string, options = {}) {
    this.sendNotification('success', message, options);
  }
  sendWarning(message:string, options = {}) {
    this.sendNotification('warning', message, options);
  }
  sendError(message:string, options = {}) {
    this.sendNotification('error', message, options);
  }

  // Custom notification functions - these are re-used in multiple paces through the app
  sendLedgerChromeWarning() {
    this.sendWarning(
      `<b>Notice:</b> You may experience issues using a Ledger device with Google Chrome. ` +
      `If you do please use Brave/Opera browser or ` +
      `<a href="https://github.com/bananocoin/bananovault/releases" target="_blank">BananoVault Desktop</a>. ` +
      `&nbsp; <a href="https://github.com/bananocoin/bananovault/issues/69" target="_blank">More Info</a>`,
      { length: 0, identifier: 'chrome-ledger' }
      );
  }

}