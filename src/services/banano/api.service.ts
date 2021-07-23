import {injectable} from "tsyringe";
import httpClient from "./http.service";
import {NodeService} from "./node.service";
import {AppSettingsService} from "./app-settings.service";

export interface NinjaVerifiedRep {
  votingweight: number;
  delegators: number;
  uptime: number;
  score: number;
  account: string;
  alias: string;
}

@injectable()
export class ApiService {
  // apiUrl = `http://localhost:9950/api`;
  //kaliumUrl = 'https://kaliumapi.appditto.com/api';
  apiUrl = `https://vault.banano.cc/api`;
  rpcUrl = `${this.apiUrl}/node-api`;

  constructor(private node: NodeService, private appSettings: AppSettingsService) { 
    httpClient.defaults.baseURL = this.apiUrl;
  }

  private async request(action, data): Promise<any> {
    data.action = action;
    let apiUrl = this.appSettings.settings.serverAPI || this.rpcUrl;
    if (this.appSettings.settings.serverNode) {
      apiUrl += `?node=${this.appSettings.settings.serverNode}`;
    }
    if (this.node.node.status === false) {
      this.node.setLoading();
    }
    console.log("sending REST call with action["+action+"]");
    //console.log("sending REST call with action["+action+"], data["+JSON.stringify(data)+"]")
    return await httpClient.post(apiUrl, data)
      .then(res => {
        this.node.setOnline();
        console.log("the REST call with action["+action+"], completed with result:"+res.statusText);
        return res.data;
      })
      .catch(err => {
        if (err.status === 500 || err.status === 0) {
          this.node.setOffline(); // Hard error, node is offline
        }
        console.log("the REST call with action["+action+"], data["+JSON.stringify(data)+"] failed with result:"+JSON.stringify(err));
        throw err;
      });
  }

  async recommendedReps(): Promise<NinjaVerifiedRep[]> {
    return await httpClient.get(`${this.apiUrl}/recommended-representatives`) as NinjaVerifiedRep[];
  }

  async accountsBalances(accounts: string[]): Promise<{balances: any }> {
    return await this.request('accounts_balances', { accounts });
  }
  async accountsFrontiers(accounts: string[]): Promise<{frontiers: any }> {
    return await this.request('accounts_frontiers', { accounts });
  }
  async accountsPending(accounts: string[], count: number = 50): Promise<{blocks: any }> {
    return await this.request('accounts_pending', { accounts, count, source: true });
  }
  async accountsPendingLimit(accounts: string[], threshold: string, count: number = 50): Promise<{blocks: any }> {
    return await this.request('accounts_pending', { accounts, count, threshold, source: true });
  }
  async delegatorsCount(account: string): Promise<{ count: string }> {
    return await this.request('delegators_count', { account });
  }
  async representativesOnline(): Promise<{ representatives: any }> {
    return await this.request('representatives_online', { });
  }

  async blocksInfo(blocks): Promise<{blocks: any, error?: string}> {
    return await this.request('blocks_info', { hashes: blocks, pending: true, source: true });
  }
  async blockCount(): Promise<{count: number, unchecked: number }> {
    return await this.request('block_count', { });
  }
  async workGenerate(hash): Promise<{ work: string }> {
    return await this.request('work_generate', { hash, use_peers: true });
  }
  async process(block): Promise<{ hash: string, error?: string }> {
    return await this.request('process', { block: JSON.stringify(block) });
  }
  async accountHistory(account, count = 25, raw = false): Promise<{history: any }> {
    return await this.request('account_history', { account, count, raw });
  }
  async accountInfo(account): Promise<any> {
    return await this.request('account_info', { account, pending: true, representative: true, weight: true });
  }
  async validateAccountNumber(account): Promise<{ valid: '1'|'0' }> {
    return await this.request('validate_account_number', { account });
  }
  async pending(account, count): Promise<any> {
    return await this.request('pending', { account, count, source: true });
  }
  async pendingLimit(account, count, threshold): Promise<any> {
    return await this.request('pending', { account, count, threshold, source: true });
  }
}