import axios from "axios";
import Cookies from "js-cookie";

const axiosclient = (useMasterKey = false) => {
	const localToken = Cookies.get(process.env.SESSION_TOKEN as string);
	console.log({ useMasterKey });
	const headers = {
		"X-Parse-Application-Id": process.env.SASHIDO_APP_ID,
		"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY,
		// "X-Parse-Session-Token": localToken
	};
	if (localToken) {
		headers["X-Parse-Session-Token"] = localToken;
	}

	if (useMasterKey) {
		headers["X-Parse-Master-Key"] = process.env
			.SASHIDO_MASTER_KEY as string;
	}

	return axios.create({
		baseURL: process.env.SASHIDO_API_URL,
		headers
	});
};

export default axiosclient;
