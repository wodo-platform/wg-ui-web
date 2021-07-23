import "./registerServiceWorker";
import Vue from "vue";
import Notifications from "vue-notification";
import App from "./App.vue";
import router, { RoutesNames } from "./router";
import store from "./store";
import "reflect-metadata";
import {container,Lifecycle} from "tsyringe";
import { AppSettingsService } from "./services/banano/app-settings.service";
import { PriceService } from "./services/banano/price.service";
import { WebsocketService } from "./services/banano/websocket.service";



Vue.config.productionTip = false;
Vue.prototype.$routesNames = RoutesNames;

container.register(
  "AppSettingsService",
  { useClass: AppSettingsService },
  { lifecycle: Lifecycle.Singleton } // <- this is important
);
container.register(
  "WebsocketService",
  { useClass: WebsocketService },
  { lifecycle: Lifecycle.Singleton } // <- this is important
);
console.log("============> registered singleton AppSettingsService");
let appSettingsService = container.resolve(AppSettingsService);

console.log("============> registered singleton  WebsocketService");
let websocketService = container.resolve(WebsocketService);
websocketService.connect();


let priceService = container.resolve(PriceService);
priceService.getPrice().then(data => (console.log("price:"+data))) ;


Vue.use(Notifications);
// add store the the main vue
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

