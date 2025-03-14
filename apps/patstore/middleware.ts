import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { User } from '@repo/types';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (
		pathname.startsWith('/_next') || // exclude Next.js internals
		pathname.startsWith('/api') || //  exclude all API routes
		pathname.startsWith('/static') || // exclude static files ||
		PUBLIC_FILE.test(pathname) // exclude all files in the public folder
	) {
		return NextResponse.next();
	}
	
	const token = request.cookies.get('patstore_token')?.value;
	const loggedInCookie = request.cookies.get('patstore_logged_in')?.value || '';
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
	let user: User | null = null as User | null;

	let projectArray: string[] = [];
	try {
		const data = await fetch(`${process.env.SASHIDO_API_URL}classes/Project`, {
			method: 'GET',
			headers: {
				'X-Parse-Application-Id': process.env.SASHIDO_APP_ID || '',
				'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY || ''
			}
		});
	
		if (data.ok) {
			const projects = await data.json();
			projects.results.forEach((project: any) => {
				projectArray.push(project.path);
			});
		} else {
			console.error('Failed to fetch projects:', data.status, data.statusText);
		}
	} catch (err: any) {
		console.error('Error fetching projects:', err.message);
	}

	let isApplicationPath = true

	if (request.nextUrl.pathname.includes('/login')) {
		isApplicationPath = false
	}

	if (request.nextUrl.pathname.includes('/invite')) {
		isApplicationPath = false
	}

	if (request.nextUrl.pathname.includes('/password')) {
		isApplicationPath = false
	}

	if (projectArray.length > 0) {
		projectArray.forEach((project) => {
			if (request.nextUrl.pathname.includes(project)) {
				isApplicationPath = false
			}
		})
	};

	if (!token && !isApplicationPath) {
		return NextResponse.next();
	} else if (!token && isApplicationPath) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (token ) {
		await fetch(`${process.env.SASHIDO_API_URL}users/me`,{ 
			method: 'GET',
			headers
		})
			.then(response => response.json())
			.then((actualData: User & {sessionToken: string}) => {
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
	
	if (loggedIn) {
		response.cookies.set('patstore_logged_in', 'true');
	}
	
	const projectId =  process.env.PROJECT_ID;
	const pathArray: string[] = ['/'];
	try {
		const data = await fetch(`https://pg-app-uefbsna5l6ijyse42wipewpjwu804d.scalabl.cloud/1/classes/Module?where={"project":{"__type":"Pointer","className":"Project","objectId":"${projectId}"}}`, {
			method: 'GET',
			headers: {
				'X-Parse-Application-Id': process.env.SASHIDO_APP_ID || '',
				'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY || ''
			}
		});
	
		if (data.ok) {
			const modules = await data.json();
			modules.results.forEach((module: any) => {
				pathArray.push(module.path);
			});
		} else {
			console.error('Failed to fetch modules:', data.status, data.statusText);
		}
	} catch (err: any) {
		console.error('Error fetching modules:', err.message);
	}

	if (!pathArray.includes(request.nextUrl.pathname ) && user?.is_superuser === false) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return response;
}