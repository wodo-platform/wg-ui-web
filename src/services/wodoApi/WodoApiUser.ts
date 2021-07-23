import "reflect-metadata";
import {container} from "tsyringe";
import { WebsocketService } from "../banano/websocket.service";
import {IUser,IUserLoginRequestParams,IUserRegisterRequestParams,IUserUpdateRequestParams} from "./models";
import WodoApiInstance from "./WodoApiBase";

const USER_PATH = "/user";
const USERS_PATH = "/users";

const user : IUser = {
  email: 'serhat.tanrikut@gmail.com',
  token: 'sdfsdfsfs234dsf',
  username: 'serhatt',
  bio: 'comp eng',
  image: null,
  wallets: null
};

export const UserLogin = async (params: IUserLoginRequestParams): Promise<IUser> => {
  const res = await WodoApiInstance.post(`${USERS_PATH}/login`, params);
  let _user: IUser =  res?.data?.user as IUser;
  if(res.status == 201 || res.status == 200 || res.status == 204){
    let websocketService = container.resolve(WebsocketService);
    websocketService.flushSubscribeAccounts();
    websocketService.connect();
    if(_user.wallets?.[0].accounts?.[0]){
      websocketService.subscribeAccounts([_user.wallets?.[0].accounts?.[0].address]);    }
  }
  return _user;
};

export const UserRegister = async (params: IUserRegisterRequestParams): Promise<IUser> => {
  const res = await WodoApiInstance.post(USERS_PATH,  params );
  return res?.data?.user as IUser;
};

export const UserGetCurrent = async (): Promise<IUser> => {
  // TODO: provide id as parameter
  const res = await WodoApiInstance.get(`${USERS_PATH}/7?childs=true`);
  return res?.data?.user as IUser;
};

export const UserUpdate = async (params: IUserUpdateRequestParams): Promise<IUser> => {
  //const res = await WodoApiInstance.put(USER_PATH, { user: params });
  //return res?.data?.user as IUser;
  return user;
};