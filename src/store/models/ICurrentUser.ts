import { ICurrentWallet } from ".";

export default interface ICurrentUser {
  email: string;
  username: string;
  bio: string;
  image: string | null;
  wallet: ICurrentWallet | null;
}
