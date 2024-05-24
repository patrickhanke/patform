import { HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";


const serverClient = (appId: string, masterKey: string) => {
    console.log(appId, 'serverClient');
    
    const { getClient } = registerApolloClient(() => {
        
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: "https://main--time-pav6zq.apollographos.net/graphql",
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
