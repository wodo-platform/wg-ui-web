import { capitalizeFirstLetter } from "@/utils/StringUtils";
import { isArrayOf } from "@/utils/ArrayUtils";

export const transformErrors = (rawErrors: any): string[] => {
  const errors = Object.entries(
    rawErrors || { unknown: ["Unknown error occurred"] }
  );
  const res: string[] = [];
  errors.forEach(entry => {
    const key = entry[0];
    const value = entry[1];
    if(isArrayOf("any",value)) {
      (value as string[]).forEach(error => {
        res.push(`${capitalizeFirstLetter(key)} ${error}`);
      });
    }
    else{
      res.push(value as string);
    }
   
  });
  return res;
};
