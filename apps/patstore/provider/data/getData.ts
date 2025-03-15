import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosapi from "./axios";

const getData = async ({
  className,
  query,
}: {
  className: string;
  query?: string;
}) => {
  let data: Array<any> = [];

  await axiosapi()
    .get(`classes/${className}`, query as AxiosRequestConfig<any>)
    .then((response: AxiosResponse<any, any>) => {
      data = response.data.results;
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });

  return data;
};

export default getData;
