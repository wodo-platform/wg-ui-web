<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Wallet</h1>
          <common-errors-list :errors="errors" />
          <form>
            <fieldset :disabled="isLoading">
              <fieldset class="form-group">
                <input
                  v-model="balance"
                  class="form-control"
                  type="text"
                  placeholder="Your current balance"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="account"
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Account"
                  required="true"
                />
              <fieldset class="seed">
                <input
                  v-model="seed"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Seed"
                  required="true"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="mnemonic"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Your mnemonic"
                ></textarea>
              </fieldset>
              </fieldset>
              <common-loader v-if="isLoading" :size="5" />
              <button
                v-else
                class="btn btn-lg btn-primary pull-xs-right"
                @click="updateWallet"
              >
                Join a game!..
              </button>
            </fieldset>
          </form>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import CommonErrorsList from "@/components/CommonErrorsList.vue";
import CommonLoader from "@/components/CommonLoader.vue";
import {ICurrentUser, ICurrentWallet, IWithdraw} from "@/store/models/";
import User from "@/store/modules/User";
import Wallet from "@/store/modules/Wallet";
import { isArrayOfStrings } from "@/utils/ArrayUtils";
import BigNumber from 'bignumber.js';
import {container} from "tsyringe";
import {WalletService} from "@/services/banano/wallet.service"


@Component({
  components: {
    CommonLoader,
    CommonErrorsList
  }
})
export default class WalletView extends Vue {

  isLoading = false;
  balance: string | null = null;
  account = "";
  seed = "test"; 
  mnemonic: string | null = null;
  errors?: string[] = []; 
  private walletService: WalletService = null;  


  mounted() {
    console.log("WalletView.mounted()...");
    this.$nextTick(function () {
      this.walletService = container.resolve(WalletService);
      if(this.seed) {
        console.log("WalletView seed:["+this.seed+"]");  
        this.walletService.createWalletFromSeed(this.seed,-2).then( data => {
          console.log("wallet initialized for user. wallet:"+JSON.stringify(this.walletService.wallet));
          console.log("wallet account count:"+this.walletService.wallet.accounts?.length);
        } 
        ).catch ( error =>{
          console.log("wallet could not be initialized for user. error:"+JSON.stringify(error));
        }
        ) ; 
      }
    console.log("WalletView is mounted.");
  })
  }

  beforeCreate() {
      console.log("beforeCreate")
    }
  created() {
    console.log("created")
  }
  beforeMount() {
    console.log("beforeMount")
  }
  beforeUpdate() {
    console.log("beforeUpdate")
  }
  updated() {
    console.log("updated")
  }
  beforeDestroy() {
    console.log("beforeDestroy")
  }
  destroyed() {
    console.log("destroyed")
  }

  get hasErrors(): boolean {
    return !!this.errors?.length;
  }

  get currentWallet(): Partial<ICurrentUser> {
    return User.currentUser || {};
  }

  logout(): void {
    User.logout();
    this.$router.push({ name: this.$routesNames.home });
  }

  async updateWallet(): Promise<void> {
    this.errors = [];
    this.isLoading = true;
    try {
      const amount:BigNumber = new BigNumber(1); 
      let str =  amount.toString();
      console.log("amount:"+str);
      let withDrawPayload : IWithdraw = {fromAccount : this.walletService.wallet.accounts?.[0],
        amount: amount
      }
      let hash = await Wallet.send(withDrawPayload);
      console.log("transaction send:"+hash);
    
      this.$router.push({ name: this.$routesNames.home });
    } catch (e) {
      if (isArrayOfStrings(e)) {
        this.errors = e;
      } else {
        throw e;
      }
    } finally {
      this.isLoading = false;
    }
  }

/**
 * watchers are invoed before lifecycle hooks such as mounted()..
 * Becase the view elements are renreded first..see methods with 'get' return type above.
 * Also watchers are invoked once per view/page load..Once single page is loaded, ccoming back to wallet view will not trigger the watcher.
 * here is the order of hooks method and watcher in this example
 * 
 *  == when the view/page is loaded for the first time ==
 *  1- beforeCreate
 *  2- watcher: onCurrenWalletLoaded
 *  3- created
 *  4- beforeMount
 *  5- mounted
 * 
 *  == any update is done on the component/view and class.  ===
 *  
 *  1- beforeUpdate
 *  2- updated
 * 
 *  Note: this.isLoading class property is chaged twice so that the methods above are invoked 2 times
 * 
 */
  @Watch("currentWallet", { immediate: true })
  onCurrenWalletLoaded(newValue: ICurrentUser): void {
     console.log("onCurrenWalletLoaded.");
    this.errors = [];
    if (newValue) {
      this.seed = newValue.wallet?.seed;
      this.account = newValue.wallet?.account;
      this.mnemonic = newValue.wallet?.mnemonic;
    }
  }
}
</script>
