import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink, from } from '@apollo/client';
import { APP_ANON_KEY, APP_URL } from '../constants/Constants';
import { MMKVStorage } from '../stores/mmkv-storage';
import { onError } from "@apollo/client/link/error";

// Creating a HTTP link for the Apollo Client with the APP_URL
const httpLink = createHttpLink({
    uri: `${APP_URL}/graphql/v1`,
});


async function getToken() {
    const token = JSON.parse(MMKVStorage.getItem('@auth-session') as string)?.state?.data?.session?.access_token;
    return token;
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            switch (err?.extensions?.code) {
                // Apollo Server sets code to UNAUTHENTICATED
                // when an AuthenticationError is thrown in a resolver
                case "UNAUTHENTICATED":
                    // Modify the operation context with a new token
                    const oldHeaders = operation.getContext().headers;
                    operation.setContext({
                        headers: {
                            ...oldHeaders,
                            authorization: getToken(),
                        },
                    });
                    // Retry the request, returning the new observable
                    return forward(operation);
            }
        }
    }

    // To retry on network errors, we recommend the RetryLink
    // instead of the onError link. This just logs the error.
    if (networkError) {
        console.log(`[Network error]: ${networkError.cause, networkError.name, networkError.message, networkError.stack}`);
    }
});


// Middleware for adding the authorization to the headers
const authMiddleware = new ApolloLink((operation, forward) => {
    // Setting the context for the operation
    const token = JSON.parse(MMKVStorage.getItem('@auth-session') as string)?.state?.data?.session?.access_token;
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: `Bearer ${token ? token : ""}`,
            apikey: `${APP_ANON_KEY}`,
            contentType: "application/json",
        }
    }));
    return forward(operation);
});



// Exporting the Apollo Client with the cache and link
const client = new ApolloClient({
    link: from([errorLink, authMiddleware, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            nextFetchPolicy: 'cache-first',
        },
    },
});
export default client;
