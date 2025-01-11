'use client';

import Cookies from 'js-cookie';
import { axiosclient } from '../data';

export const logoutUser = async () => {
	await axiosclient().post('logout');
	Cookies.remove(process.env.SESSION_TOKEN as string);
	Cookies.remove(`${process.env.SESSION_TOKEN}_logged_in`);
    
	return window.location.pathname = '/login';
};