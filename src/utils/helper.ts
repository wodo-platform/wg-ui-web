import Data from "@/dto/data";

export const server = {
    baseURL: 'http://localhost:3000/api'
}

export interface CustomWindow extends Window {
    dataArray: Data[];
}

