"use client";

import Cookies from "js-cookie";
import { ApolloLink, HttpLink } from "@apollo/client";

import {
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";
import { makeClientProps } from "./types";
// import { InMemoryCache } from '@apollo/client-react-streaming';

const makeClient: makeClientProps = (uri, appId, restKey) => {
  const localToken = Cookies.get(process.env.SESSION_TOKEN as string);

  const token = localToken || "";

  const httpLink = new HttpLink({
    uri,
    headers: {
      "X-Parse-Application-Id": appId || "",
      "X-Parse-REST-API-Key": restKey || "",
      // "X-Parse-Master-Key": restKey || "",
      "X-Parse-Session-Token": token,
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        ObjectsQuery: {
          merge(existing, incoming, { mergeObjects }) {
            return mergeObjects(existing, incoming);
          },
        },
      },
      dataIdFromObject(responseObject) {
        return (responseObject.objectId as string) || undefined;
      },
    }),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
};

export default makeClient;
