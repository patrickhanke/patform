/* eslint-disable no-undef */
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosclient = propToken => {
	const localToken = Cookies.get('hgs_token');
	const token = localToken || propToken;
	return axios.create({
		baseURL: process.env.SASHIDO_API_URL,
		headers: {
			'X-Parse-Application-Id':  process.env.SASHIDO_APP_ID,
			'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY,
			'X-Parse-Master-Key': process.env.SASHIDO_MASTER_KEY,
			'X-Parse-Session-Token': token
		}
	});
};

export default axiosclient;
