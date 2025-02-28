import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		pathname.startsWith('/_next') || // exclude Next.js internals
		pathname.startsWith('/api') || //  exclude all API routes
		pathname.startsWith('/static') || // exclude static files
		pathname.startsWith('/survey') || // exclude static files
		pathname.startsWith('/portal') || // exclude static files
		pathname.startsWith('/pdf') || // exclude static files
		PUBLIC_FILE.test(pathname) // exclude all files in the public folder
	) {
		return NextResponse.next();
	}
	
	const token = request.cookies.get('patwork_token')?.value as string;
	const loggedInCookie = request.cookies.get('patwork_logged_in')?.value || '';
	let loggedIn = loggedInCookie ==='true'|| false;

	if (!token) {
		loggedIn = false;
	} 
	const httpHeaders = {
		'X-Parse-Session-Token': token || '',
		'X-Parse-Application-Id': process.env.SASHIDO_APP_ID || '',
		'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY || ''
	};

	const headers = new Headers(httpHeaders);

	if (token && !loggedIn ) {
		await fetch(`${process.env.SASHIDO_API_URL}users/me`,{ 
			method: 'GET',
			headers
		})
			.then(response => response.json())
			.then(actualData => {
				if (actualData.sessionToken === token) {
					loggedIn = true;
					
				}		
			})
			.catch(() => {
				loggedIn = false;
			});
	}
	const response = NextResponse.next();

	if (!token && request.nextUrl.pathname !== '/login') {

		return NextResponse.rewrite(new URL('/login', request.url));
	}
	if (loggedIn) {
		response.cookies.set('patwork_logged_in', 'true');
	}
	return response;
}

// export const config = {
// 	matcher:[ '/app/(application)/:path*']
// }
