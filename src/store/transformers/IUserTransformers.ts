import { IUser } from "@/services/wodoApi/models";

import { ICurrentUser, ICurrentWallet } from "../models";

export const TransformICurrentUserToIUser = (iUser: IUser): ICurrentUser => {
  let iCurrentWallet : ICurrentWallet = {
    account: iUser.wallets?.[0]?.accounts?.[0]?.address,
    seed: iUser.wallets?.[0]?.seed,
    mnemonic:iUser.wallets?.[0]?.mnemonic
  }
  return {
    bio: iUser.bio,
    email: iUser.email,
    image: iUser.image,
    username: iUser.username,
    wallet : iCurrentWallet
  };
};
