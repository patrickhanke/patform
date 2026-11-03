import axios from "axios";
import Cookies from "js-cookie";

// Browser client: session token only. Master-key requests must go through `/api/data`.
const axiosclient = () => {
	const localToken = Cookies.get(process.env.SESSION_TOKEN as string);
	const headers = {
		"X-Parse-Application-Id": process.env.SASHIDO_APP_ID,
		"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY,
		"X-Parse-Session-Token": localToken
	};

	return axios.create({
		baseURL: process.env.SASHIDO_API_URL,
		headers
	});
};

export default axiosclient;
