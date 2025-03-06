/* eslint-disable no-undef */
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosclient = () => {
	const localToken = Cookies.get(process.env.SESSION_TOKEN as string);
	console.log(process.env.SASHIDO_API_URL);
	console.log(localToken)
	
	return axios.create({
		baseURL: process.env.SASHIDO_API_URL,
		headers: {
			'X-Parse-Application-Id':  process.env.SASHIDO_APP_ID,
			'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY,
			'X-Parse-Session-Token': localToken
		}
	});
};

export default axiosclient;
