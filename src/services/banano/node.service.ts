import {injectable} from "tsyringe";
import {NotificationService} from "./notification.service";

@injectable()
export class NodeService {

  node = {
    status: null, // null - loading, false - offline, true - online
  };

  constructor(private notifications: NotificationService) { }

  setOffline() {
    if (this.node.status === false) return; // Already offline
    this.node.status = false;

    this.notifications.sendError(`Unable to connect to the Banano node, your balances may be inaccurate!`, { identifier: 'node-offline', length: 0 });
  }

  setOnline() {
    if (this.node.status) return; // Already online

    this.node.status = true;
    this.notifications.removeNotification('node-offline');
  }

  setLoading() {
    this.node.status = null;
  }

}