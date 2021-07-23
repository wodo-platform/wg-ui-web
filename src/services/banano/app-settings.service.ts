import set = Reflect.set;
import {singleton} from "tsyringe";
export type WalletStore = 'localStorage'|'none';
export type PoWSource = 'server'|'clientCPU'|'clientWebGL'|'best';

interface AppSettings {
  displayDenomination: string;
  // displayPrefix: string | null;
  walletStore: string;
  displayCurrency: string;
  defaultRepresentative: string | null;
  lockOnClose: number;
  lockInactivityMinutes: number;
  powSource: PoWSource;
  serverName: string;
  serverAPI: string | null;
  serverNode: string | null;
  serverWS: string | null;
  minimumReceive: string | null;
  coinType: string | null;
}


@singleton()
export class AppSettingsService {
  storeKey = `bananovault-appsettings`;

  public coinTypeBanano : string = "banano";

  settings: AppSettings = {
    displayDenomination: 'banano',
    // displayPrefix: 'xrb',
    walletStore: 'localStorage',
    displayCurrency: 'USD',
    defaultRepresentative: null,
    lockOnClose: 1,
    lockInactivityMinutes: 30,
    powSource: 'best',
    serverName: 'bananovault',
    serverAPI: null,
    serverNode: null,
    serverWS: null,
    minimumReceive: null,
    coinType: this.coinTypeBanano,
  };

  constructor() { 
    console.log("new instaance app service:"+ new Date());
  }

  loadAppSettings() {
    let settings: AppSettings = this.settings;
    const settingsStore = localStorage.getItem(this.storeKey);
    if (settingsStore) {
      settings = JSON.parse(settingsStore);
    }
    if(settings.coinType) {
      settings.coinType = this.coinTypeBanano;
    }
    this.settings = Object.assign(this.settings, settings);

    return this.settings;
  }

  saveAppSettings() {
    localStorage.setItem(this.storeKey, JSON.stringify(this.settings));
  }

  getAppSetting(key:string) {
    return (this.settings as any)[key] || null;
  }

  setAppSetting(key: string, value:any) {
    (this.settings as any)[key]= value;
    this.saveAppSettings();
  }

  setAppSettings(settingsObject:any) {
    for (const key in settingsObject) {
      if (!settingsObject.prototype.hasOwnProperty(key)) continue;
      (this.settings as any)[key] = settingsObject[key];
    }

    this.saveAppSettings();
  }

  clearAppSettings() {
    localStorage.removeItem(this.storeKey);
    this.settings = {
      displayDenomination: 'banano',
      // displayPrefix: 'xrb',
      walletStore: 'localStorage',
      displayCurrency: 'USD',
      defaultRepresentative: null,
      lockOnClose: 1,
      lockInactivityMinutes: 30,
      powSource: 'best',
      serverName: 'bananovault',
      serverNode: null,
      serverAPI: null,
      serverWS: null,
      minimumReceive: null,
      coinType: this.coinTypeBanano,
    };
  }

}