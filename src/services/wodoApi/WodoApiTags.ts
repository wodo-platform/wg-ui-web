import WodoApiInstance from "./WodoApiBase";

const TAGS_PATH = "/tags";

export const TagsGet = async (): Promise<string[]> => {
  //const res = await WodoApiInstance.get(TAGS_PATH);
  //return res?.data?.tags as string[];
  return ["serhat","wodo", "banano", "agones"];
};
