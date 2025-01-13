'use client';

import Cookies from 'js-cookie';
import {
	ApolloLink,
	HttpLink
} from '@apollo/client';

import {
	ApolloClient,
	InMemoryCache,
	SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support';
import { makeClientProps } from './types.js';
// import { InMemoryCache } from '@apollo/client-react-streaming';

const makeClient: makeClientProps = (appId, masterKey) => {
	const localToken = Cookies.get('patstore_token');

	const token = localToken || '';

	const httpLink = new HttpLink({
		uri: 'https://pg-app-uefbsna5l6ijyse42wipewpjwu804d.scalabl.cloud/graphql/',
		headers: {
			'X-Parse-Application-Id': appId || '',
			// 'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY || '',
			'X-Parse-Master-Key': masterKey || ''
			// 'X-Parse-Session-Token': token
		}
	});

	return new ApolloClient({
		cache: new InMemoryCache({
			typePolicies: {
				ObjectsQuery: {
					merge(existing, incoming, { mergeObjects }) {
						return mergeObjects(existing, incoming);
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
				httpLink
			])
			: 
			httpLink
	});
};

export default makeClient;