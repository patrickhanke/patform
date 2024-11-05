import { axiosclient } from '@repo/provider';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { User } from '@repo/types';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		pathname.startsWith('/_next') || // exclude Next.js internals
		pathname.startsWith('/api') || //  exclude all API routes
		pathname.startsWith('/static') || // exclude static files
		PUBLIC_FILE.test(pathname) // exclude all files in the public folder
	) {
		return NextResponse.next();
	}
	
	const token = request.cookies.get('patform_token')?.value as string;
	const loggedInCookie = request.cookies.get('patform_logged_in')?.value || '';
	let loggedIn = loggedInCookie ==='true'|| false;

	if (!token) {
		loggedIn = false;
	} 
	console.log(token, 'token');
	console.log(loggedIn, 'log');
	console.log(process.env.SASHIDO_API_URL, 'url');

	
	const httpHeaders = {
		'X-Parse-Session-Token': token || '',
		'X-Parse-Application-Id': process.env.SASHIDO_APP_ID || '',
		'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY || ''
	};

	const headers = new Headers(httpHeaders);
	let user: User | null = null as User | null;

	if (token ) {
		await fetch(`${process.env.SASHIDO_API_URL}users/me`,{ 
			method: 'GET',
			headers
		})
			.then(response => response.json())
			.then((actualData: User & {sessionToken: string}) => {
				console.log(actualData, 'actualData');
				
				if (actualData.sessionToken === token && !loggedIn) {
					loggedIn = true;
				}		
				user = actualData
			})
			.catch(() => {
				console.log('error');
				
				loggedIn = false;
			});
		}
	const response = NextResponse.next();

	if (!token && request.nextUrl.pathname !== '/login') {
		return NextResponse.rewrite(new URL('/login', request.url));
	}
	
	if (loggedIn) {
		response.cookies.set('patform_logged_in', 'true');
	}
	
	const projectId =  process.env.PROJECT_ID;
	const pathArray: string[] = [];
	await axiosclient().get(`classes/Module?where={"project":{"__type":"Pointer","className":"Project","objectId":"${projectId}"}}`).then((res) => {
		res.data.results.forEach((module: any) => {
			pathArray.push(module.path)
		})
	}).catch((err) => {
		console.log(err.message)
	})
	
	if (!pathArray.includes(request.nextUrl.pathname ) && user?.is_superuser === false) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return response;
}

// export const config = {
// 	matcher:[ '/app/(application)/:path*']
// }
