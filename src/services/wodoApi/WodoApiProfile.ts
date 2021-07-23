import { IProfile } from "./models";
import WodoApiInstance from "./WodoApiBase";
import {iprofileMock} from "./mock.data"


const PROFILES_PATH = "/profiles";

export const ProfileGet = async (username: string): Promise<IProfile> => {
  //const res = await WodoApiInstance.get(`${PROFILES_PATH}/${username}`);
  //return res?.data?.profile as IProfile;
  return iprofileMock;
};

export const ProfileFollow = async (username: string): Promise<IProfile> => {
  //const res = await WodoApiInstance.post(  `${PROFILES_PATH}/${username}/follow`);
  //return res?.data?.profile as IProfile;
  return iprofileMock;
};

export const ProfileUnfollow = async (username: string): Promise<IProfile> => {
  //const res = await WodoApiInstance.delete(`${PROFILES_PATH}/${username}/follow`);
  //return res?.data?.profile as IProfile;
  return iprofileMock;
};
