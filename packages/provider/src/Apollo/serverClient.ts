import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";

const serverClient = (appUrl: string, appId: string, masterKey: string) => {
    console.log(appUrl, 'url');
    console.log(appId, 'appId');
    console.log(masterKey, 'masterKey');
    
    const { getClient } = registerApolloClient(() => {
        
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: 'https://pg-app-uefbsna5l6ijyse42wipewpjwu804d.scalabl.cloud/graphql/',
            headers: {
                'X-Parse-Application-Id': appId || '',
                // 'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY || '',
                'X-Parse-Master-Key':  masterKey || ''
                // 'X-Parse-Session-Token': token
            }
        }),
      });
    });

    return getClient();

}

export default serverClient;
