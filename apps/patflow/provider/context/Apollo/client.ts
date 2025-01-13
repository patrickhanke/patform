'use client';

import Cookies from 'js-cookie';
import {
	from,
	ApolloLink,
	HttpLink
} from '@apollo/client';

import {
	NextSSRApolloClient,
	NextSSRInMemoryCache,
	SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
const removeTypenameLink = removeTypenameFromVariables();


function makeClient() {
	const localToken = Cookies.get(process.env.SESSION_TOKEN as string);

	const token = localToken || '';

	const httpLink = new HttpLink({
		uri: 'https://pg-app-ks588wtqbcwvgvbc096gr40cedytjy.scalabl.cloud/graphql/',
		headers: {
			'X-Parse-Application-Id':  process.env.SASHIDO_APP_ID || '',
			// 'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY || '',
			'X-Parse-Master-Key': process.env.SASHIDO_MASTER_KEY || ''
			// 'X-Parse-Session-Token': token
		}
	});

	const link = from([removeTypenameLink, httpLink]);


	return new NextSSRApolloClient({
		cache: new NextSSRInMemoryCache({
			typePolicies: {
				ObjectsQuery: {
					queryType: true,
					merge(existing, incoming) {
						return {...existing, ...incoming};
					}
				}
			},
			dataIdFromObject(responseObject) {
				return responseObject.objectId as string || undefined;
			}
		}),
		link: typeof window === 'undefined' ? 
			ApolloLink.from([
				new SSRMultipartLink({
					stripDefer: true
				}),
				link
			])
			: 
			link
	});
}

export default makeClient;