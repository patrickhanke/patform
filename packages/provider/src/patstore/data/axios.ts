/* eslint-disable no-undef */
import axios from "axios";
import Cookies from "js-cookie";

const axiosclient = (propToken?: string) => {
  const localToken = Cookies.get("patstore_token");
  const token = localToken || propToken;
  console.log(process.env.SASHIDO_API_URL);

  return axios.create({
    baseURL: process.env.SASHIDO_API_URL,
    headers: {
      "X-Parse-Application-Id": process.env.SASHIDO_APP_ID,
      "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY,
      "X-Parse-Master-Key": process.env.SASHIDO_MASTER_KEY,
      "X-Parse-Session-Token": token,
    },
  });
};

// const axiosclient = (
// 	propToken: string,
// 	baseURL: string,
// 	appId: string,
// 	restKey: string,
// 	masterKey: string
// ) => {
// 	const localToken = Cookies.get('patstore_token');
// 	const token = localToken || propToken;
// 	return axios.create({
// 		baseURL: baseURL,
// 		headers: {
// 			'X-Parse-Application-Id':  appId,
// 			'X-Parse-REST-API-Key': restKey,
// 			'X-Parse-Master-Key': masterKey,
// 			'X-Parse-Session-Token': token
// 		}
// 	});
// };

export default axiosclient;
