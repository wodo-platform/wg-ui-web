import { IWallet } from ".";

export default interface IUser {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string | null;
  wallets: IWallet[] | null
}
